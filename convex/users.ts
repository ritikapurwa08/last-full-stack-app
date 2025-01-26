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
    image: v.optional(v.string()),
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    instagram: v.optional(v.string()),
    website: v.optional(v.string()),
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

      // Set the uploadedImageUrl to undefined
      await ctx.db.patch(userId, {
        uploadedImageStorageId: undefined,
        uploadedImageUrl: undefined,
      });
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

export const removeConvexStorageIdAndUrl = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // First, get the current user data
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    // If there's a storage ID, delete the file from storage
    if (user.uploadedImageStorageId) {
      await ctx.storage.delete(user.uploadedImageStorageId);
    }

    // Now update the user document
    return await ctx.db.patch(args.userId, {
      uploadedImageStorageId: undefined,
      uploadedImageUrl: undefined,
    });
  },
});

export const updateCustomImage = mutation({
  args: {
    customImage: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    return await ctx.db.patch(userId, {
      customImage: args.customImage,
    });
  },
});

export const removeCustomImage = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    return await ctx.db.patch(args.userId, {
      customImage: undefined,
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
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    return await ctx.db.patch(userId, {
      imagePreference: args.preference,
    });
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

    // Get userStats document for this user to get their following list
    const userStats = await ctx.db
      .query("userStats")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .unique();

    if (!userStats || !userStats.followingUsers) {
      return [];
    }

    // Get full user details for each followed user
    const followingUsers = await Promise.all(
      userStats.followingUsers.map(async (followedId) => {
        const followedUser = await ctx.db.get(followedId);
        if (!followedUser) return null;

        return {
          id: followedUser._id,
          name: followedUser.name,
          email: followedUser.email,
          customImage: followedUser.customImage,
        };
      })
    );

    // Filter out any null values and return
    return followingUsers.filter(
      (user): user is NonNullable<typeof user> => user !== null
    );
  },
});
