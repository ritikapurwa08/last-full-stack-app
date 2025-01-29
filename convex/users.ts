import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) return null;
    const user = await ctx.db.get(userId);

    if (!user) return null;

    return user;
  },
});

export const checkEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .unique();
    return user !== null;
  },
});

export const updateUser = mutation({
  args: {
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    customImage: v.optional(v.string()),
    instagram: v.optional(v.string()),
    website: v.optional(v.string()),
    showEmail: v.optional(v.boolean()),
    showInstagram: v.optional(v.boolean()),
    showWebsite: v.optional(v.boolean()),
    showFollowers: v.optional(v.boolean()),
    showFollowing: v.optional(v.boolean()),
    showPosts: v.optional(v.boolean()),
    showSavedPosts: v.optional(v.boolean()),
    showLikedPosts: v.optional(v.boolean()),
    showLocation: v.optional(v.boolean()),
    showBio: v.optional(v.boolean()),
    showJoinedAt: v.optional(v.boolean()),
    showLastActive: v.optional(v.boolean()),
    messagePrivacy: v.optional(
      v.union(v.literal("everyone"), v.literal("followers"), v.literal("none"))
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }
    const user = await ctx.db.patch(userId, {
      ...args,
    });
    return user;
  },
});

export const getUserById = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return ctx.db.get(args.userId);
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const uploadUserImage = mutation({
  args: {
    imageStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    // Delete the existing image if it exists
    if (user.uploadedImageStorageId) {
      await ctx.storage.delete(user.uploadedImageStorageId);
    }

    // Generate the URL for the new uploaded image
    const uploadedImageUrl = await ctx.storage.getUrl(args.imageStorageId);

    // Update the user document with both the new storage ID and the URL
    const updatedUser = await ctx.db.patch(userId, {
      uploadedImageStorageId: args.imageStorageId,
      uploadedImageUrl: uploadedImageUrl ?? undefined,
    });

    return updatedUser;
  },
});

export const updateRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("user"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) throw new Error("Unauthorized");

    const currentUser = await ctx.db.get(currentUserId);
    if (!currentUser || currentUser.role !== "admin") {
      throw new Error("Only admins can update roles");
    }

    return await ctx.db.patch(args.userId, {
      role: args.role,
    });
  },
});

export const updateLastActive = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.userId, {
      lastActive: new Date().toISOString(),
    });
  },
});

export const updateMessagePrivacy = mutation({
  args: {
    privacy: v.union(
      v.literal("everyone"),
      v.literal("followers"),
      v.literal("none")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    return await ctx.db.patch(userId, {
      messagePrivacy: args.privacy,
    });
  },
});

export const updateImagePreference = mutation({
  args: {
    preference: v.union(v.literal("custom"), v.literal("convex")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    return await ctx.db.patch(userId, {
      imagePreference: args.preference,
    });
  },
});

export const updateVisibilitySettings = mutation({
  args: {
    showEmail: v.optional(v.boolean()),
    showInstagram: v.optional(v.boolean()),
    showWebsite: v.optional(v.boolean()),
    showFollowers: v.optional(v.boolean()),
    showFollowing: v.optional(v.boolean()),
    showPosts: v.optional(v.boolean()),
    showSavedPosts: v.optional(v.boolean()),
    showLikedPosts: v.optional(v.boolean()),
    showLocation: v.optional(v.boolean()),
    showBio: v.optional(v.boolean()),
    showJoinedAt: v.optional(v.boolean()),
    showLastActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    return await ctx.db.patch(userId, {
      ...args,
    });
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

    // Get current user
    const currentUser = await ctx.db.get(userId);
    if (!currentUser) {
      throw new Error("User not found");
    }

    // Get user to follow
    const userToFollow = await ctx.db.get(args.userIdToFollow);
    if (!userToFollow) {
      throw new Error("User to follow not found");
    }

    // Update current user's following list
    const followingUsers = currentUser.followingUsers || [];
    if (!followingUsers.includes(args.userIdToFollow)) {
      await ctx.db.patch(userId, {
        followingUsers: [...followingUsers, args.userIdToFollow],
        followingCount: (currentUser.followingCount || 0) + 1,
      });
    }

    // Update followed user's followers count
    const followedUsers = userToFollow.followedUser || [];
    if (!followedUsers.includes(userId)) {
      await ctx.db.patch(args.userIdToFollow, {
        followedUser: [...followedUsers, userId],
        followersCount: (userToFollow.followersCount || 0) + 1,
      });
    }

    return args.userIdToFollow;
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

    const currentUser = await ctx.db.get(userId);
    if (!currentUser) {
      throw new Error("User not found");
    }

    const userToUnfollow = await ctx.db.get(args.userIdToUnfollow);
    if (!userToUnfollow) {
      throw new Error("User to unfollow not found");
    }

    // Update current user's following list
    const followingUsers = currentUser.followingUsers || [];
    if (followingUsers.includes(args.userIdToUnfollow)) {
      await ctx.db.patch(userId, {
        followingUsers: followingUsers.filter(
          (id) => id !== args.userIdToUnfollow
        ),
        followingCount: Math.max(0, (currentUser.followingCount || 0) - 1),
      });
    }

    // Update unfollowed user's followers list
    const followedUsers = userToUnfollow.followedUser || [];
    if (followedUsers.includes(userId)) {
      await ctx.db.patch(args.userIdToUnfollow, {
        followedUser: followedUsers.filter((id) => id !== userId),
        followersCount: Math.max(0, (userToUnfollow.followersCount || 0) - 1),
      });
    }

    return args.userIdToUnfollow;
  },
});

export const isFollwingUser = query({
  args: {
    targetUserId: v.id("users"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userOne = await ctx.db.get(args.userId);
    const userTwo = await ctx.db.get(args.targetUserId);

    if (!userOne || !userTwo) {
      return null;
    }

    const userOneStats = await ctx.db.get(args.userId);
    const userTwoStats = await ctx.db.get(args.targetUserId);

    if (!userOneStats || !userTwoStats) {
      return null;
    }

    return userOneStats.followingUsers?.includes(args.targetUserId) ?? false;
  },
});

export const getUserAllFollowers = query({
  args: {
    userId: v.id("users"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    // Get the user to find who follows them
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }
    // Get paginated user details for each follower
    const followers = await ctx.db
      .query("users")
      .filter((q) => q.eq(user.followedUser, q.field("_id")))
      .order("desc")
      .paginate(args.paginationOpts);

    return followers;
  },
});

export const removeConvexStorageIdAndUrl = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Get the user
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Update user document to remove storage ID and URL
    await ctx.db.patch(args.userId, {
      uploadedImageStorageId: undefined,
      uploadedImageUrl: undefined,
    });

    return true;
  },
});
export const updateCustomImage = mutation({
  args: {
    userId: v.id("users"),
    customImage: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the user
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Update user document with new custom image URL
    await ctx.db.patch(args.userId, {
      customImage: args.customImage,
    });

    return true;
  },
});

export const removeCustomImage = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Get the user
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Update user document to remove custom image
    await ctx.db.patch(args.userId, {
      customImage: undefined,
    });

    return true;
  },
});

export const getUserAllFollowingList = query({
  args: {
    userId: v.id("users"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.followingUsers.length === 0) {
      return {
        page: [],
        isDone: true,
        continueCursor: "",
      };
    }
    const followingUsers = await ctx.db
      .query("users")
      .filter((q) =>
        q.or(
          ...user.followingUsers.map((followedUserId) =>
            q.eq(q.field("_id"), followedUserId)
          )
        )
      )
      .order("desc")
      .paginate(args.paginationOpts);

    return followingUsers;
  },
});

export const getUserAllFollowersList = query({
  args: {
    userId: v.id("users"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Handle the case where the user has no followers
    if (user.followedUser.length === 0) {
      return {
        page: [],
        isDone: true,
        continueCursor: "",
      };
    }

    const followers = await ctx.db
      .query("users")
      .filter((q) =>
        q.or(
          ...user.followedUser.map((followerId) =>
            q.eq(q.field("_id"), followerId)
          )
        )
      )
      .order("desc")
      .paginate(args.paginationOpts);

    return followers;
  },
});

// mutations.ts
export const AddUserDetails = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    instagram: v.optional(v.string()),
    website: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    return await ctx.db.patch(args.userId, {
      name: args.name ?? "",
      bio: args.bio ?? "",
      location: args.location ?? "",
      instagram: args.instagram ?? "", // Provide empty string if not present
      website: args.website ?? "", // Provide empty string if not present
    });
  },
});

export const UpdateUserPreferences = mutation({
  args: {
    userId: v.id("users"),
    showEmail: v.optional(v.boolean()),
    showInstagram: v.optional(v.boolean()),
    showWebsite: v.optional(v.boolean()),
    showFollowers: v.optional(v.boolean()),
    showFollowing: v.optional(v.boolean()),
    showPosts: v.optional(v.boolean()),
    showSavedPosts: v.optional(v.boolean()),
    showLikedPosts: v.optional(v.boolean()),
    showLocation: v.optional(v.boolean()),
    showBio: v.optional(v.boolean()),
    showJoinedAt: v.optional(v.boolean()),
    showLastActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    return await ctx.db.patch(args.userId, {
      showEmail: args.showEmail ?? user.showEmail,
      showInstagram: args.showInstagram ?? user.showInstagram,
      showWebsite: args.showWebsite ?? user.showWebsite,
      showFollowers: args.showFollowers ?? user.showFollowers,
      showFollowing: args.showFollowing ?? user.showFollowing,
      showPosts: args.showPosts ?? user.showPosts,
      showSavedPosts: args.showSavedPosts ?? user.showSavedPosts,
      showLikedPosts: args.showLikedPosts ?? user.showLikedPosts,
      showLocation: args.showLocation ?? user.showLocation,
      showBio: args.showBio ?? user.showBio,
      showJoinedAt: args.showJoinedAt ?? user.showJoinedAt,
      showLastActive: args.showLastActive ?? user.showLastActive,
    });
  },
});
