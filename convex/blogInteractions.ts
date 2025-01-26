import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";

export const getUserFollowing = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Get the user stats to find who they're following
    const userStats = await ctx.db
      .query("userStats")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .unique();

    if (!userStats?.followingUsers) {
      return [];
    }

    // Get the user details for each followed user
    const followingUsers = await Promise.all(
      userStats.followingUsers.map(async (followedUserId) => {
        const user = await ctx.db.get(followedUserId);
        if (!user) return null;
        return {
          id: user._id,
          name: user.name,
          image: user.image,
        };
      })
    );

    // Filter out any null values and return
    return followingUsers.filter(
      (user): user is NonNullable<typeof user> => user !== null
    );
  },
});

export const followUser = mutation({
  args: {
    userIdToFollow: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get or create user stats for current user
    const userStats = await ctx.db
      .query("userStats")
      .filter((q) => q.eq(q.field("userId"), userId))
      .unique();

    if (!userStats) {
      // Create new user stats if doesn't exist
      await ctx.db.insert("userStats", {
        userId,
        followingUsers: [args.userIdToFollow],
        followersCount: 0,
        followingCount: 1,
        postsCount: 0,
        savedPostsCount: 0,
        likedPostsCount: 0,
        totalMessages: 0,
        unreadMessages: 0,
        lastActive: new Date().toISOString(),
      });
    } else {
      // Update existing user stats
      const followingUsers = userStats.followingUsers || [];
      if (!followingUsers.includes(args.userIdToFollow)) {
        await ctx.db.patch(userStats._id, {
          followingUsers: [...followingUsers, args.userIdToFollow],
          followingCount: (userStats.followingCount || 0) + 1,
        });
      }
    }

    // Update follower's stats
    const followerStats = await ctx.db
      .query("userStats")
      .filter((q) => q.eq(q.field("userId"), args.userIdToFollow))
      .unique();

    if (!followerStats) {
      await ctx.db.insert("userStats", {
        userId: args.userIdToFollow,
        followersCount: 1,
        followingCount: 0,
        postsCount: 0,
        savedPostsCount: 0,
        likedPostsCount: 0,
        totalMessages: 0,
        unreadMessages: 0,
        lastActive: new Date().toISOString(),
      });
    } else {
      await ctx.db.patch(followerStats._id, {
        followersCount: (followerStats.followersCount || 0) + 1,
      });
    }

    return true;
  },
});

export const unfollowUser = mutation({
  args: {
    userIdToUnfollow: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get user stats
    const userStats = await ctx.db
      .query("userStats")
      .filter((q) => q.eq(q.field("userId"), userId))
      .unique();

    if (!userStats) {
      throw new Error("User stats not found");
    }

    // Remove user from following list and decrement count
    const followingUsers = userStats.followingUsers || [];
    if (followingUsers.includes(args.userIdToUnfollow)) {
      await ctx.db.patch(userStats._id, {
        followingUsers: followingUsers.filter(
          (id) => id !== args.userIdToUnfollow
        ),
        followingCount: Math.max(0, (userStats.followingCount || 0) - 1),
      });
    }

    // Update follower's stats
    const followerStats = await ctx.db
      .query("userStats")
      .filter((q) => q.eq(q.field("userId"), args.userIdToUnfollow))
      .unique();

    if (followerStats) {
      await ctx.db.patch(followerStats._id, {
        followersCount: Math.max(0, (followerStats.followersCount || 0) - 1),
      });
    }

    return true;
  },
});

export const isFollowingUser = query({
  args: {
    userId: v.id("users"),
    targetUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userStats = await ctx.db
      .query("userStats")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .unique();

    if (!userStats || !userStats.followingUsers) {
      return false;
    }

    return userStats.followingUsers.includes(args.targetUserId);
  },
});

export const getUserAllFollowing = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userStats = await ctx.db
      .query("userStats")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .unique();

    if (!userStats) {
      return 0;
    }

    return userStats.followingCount || 0;
  },
});
export const getUserAllFollowers = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userStats = await ctx.db
      .query("userStats")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .unique();

    if (!userStats) {
      return 0;
    }

    return userStats.followersCount || 0;
  },
});

export const getPaginatedUserLikedBlogs = query({
  args: {
    userId: v.id("users"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    // First get all blog interactions for this user where type is "like"
    const likedInteractions = await ctx.db
      .query("blogInteractions")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.eq(q.field("type"), "like")
        )
      )
      .collect();

    // Get the blog IDs
    const blogIds = likedInteractions.map((interaction) => interaction.blogId);

    // Get paginated blogs that match these IDs
    const likedBlogs = await ctx.db
      .query("blogs")
      .filter((q) => q.eq(blogIds, q.field("_id")))
      .order("desc")
      .paginate(args.paginationOpts);

    return likedBlogs;
  },
});

export const getPaginatedUserSavedBlogs = query({
  args: {
    userId: v.id("users"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    // First get all blog interactions for this user where type is "save"
    const savedInteractions = await ctx.db
      .query("blogInteractions")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.eq(q.field("type"), "save")
        )
      )
      .collect();

    // Get the blog IDs
    const blogIds = savedInteractions.map((interaction) => interaction.blogId);

    // Get paginated blogs that match these IDs
    const savedBlogs = await ctx.db
      .query("blogs")
      .filter((q) => q.eq(blogIds, q.field("_id")))
      .order("desc")
      .paginate(args.paginationOpts);

    return savedBlogs;
  },
});

export const getUserLikedBlogsCount = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userStats = await ctx.db
      .query("userStats")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .unique();

    if (!userStats) {
      return 0;
    }

    return userStats.likedPostsCount || 0;
  },
});

export const getUserSavedBlogsCount = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userStats = await ctx.db
      .query("userStats")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .unique();

    if (!userStats) {
      return 0;
    }

    return userStats.savedPostsCount || 0;
  },
});
