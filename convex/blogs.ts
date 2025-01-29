import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";

export const createBlog = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    customImage: v.string(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const blogId = await ctx.db.insert("blogs", {
      userId,
      title: args.title,
      content: args.content,
      likesCount: 0,
      savedCount: 0,
      commentsCount: 0,
      customImage: args.customImage,
      tags: args.tags,
      isOwner: true,
      likedBy: [],
      savedBy: [],
      comments: [],
    });

    return blogId;
  },
});

export const updateBlog = mutation({
  args: {
    blogId: v.id("blogs"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    customImage: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }
    const blog = await ctx.db.get(args.blogId);
    if (!blog) {
      throw new Error("Blog not found");
    }
    if (blog.userId !== userId) {
      throw new Error("Unauthorized");
    }
    const blogId = await ctx.db.patch(args.blogId, {
      title: args.title,
      content: args.content,
      customImage: args.customImage,
      tags: args.tags,
    });

    return blogId;
  },
});

export const removeBlog = mutation({
  args: {
    blogId: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const blog = await ctx.db.get(args.blogId);
    if (!blog) {
      throw new Error("Blog not found");
    }
    if (blog.userId !== userId) {
      throw new Error("Unauthorized");
    }
    if (blog.uploadedImageStorageId) {
      await ctx.storage.delete(blog.uploadedImageStorageId);
    }
    const blogId = await ctx.db.delete(args.blogId);
    return blogId;
  },
});

export const isAlreadyLikedBlog = query({
  args: {
    blogId: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error(
        "Unauthorized: User must be logged in to check like status."
      );
    }

    const blog = await ctx.db.get(args.blogId);
    if (!blog) {
      throw new Error("Blog not found.");
    }

    return blog.likedBy.includes(userId);
  },
});

export const isAlreadySavedBlog = query({
  args: {
    blogId: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error(
        "Unauthorized: User must be logged in to check save status."
      );
    }

    const blog = await ctx.db.get(args.blogId);
    if (!blog) {
      throw new Error("Blog not found.");
    }

    return blog.savedBy.includes(userId);
  },
});

export const likeBlog = mutation({
  args: {
    blogId: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized: User must be logged in to like a blog.");
    }

    const blog = await ctx.db.get(args.blogId);
    if (!blog) {
      throw new Error("Blog not found.");
    }

    // Check if the user has already liked the blog
    if (blog.likedBy.includes(userId)) {
      throw new Error("User has already liked this blog.");
    }

    // Add the user to the likedBy array and increment likesCount
    await ctx.db.patch(args.blogId, {
      likedBy: [...blog.likedBy, userId],
      likesCount: blog.likesCount + 1,
    });

    return args.blogId;
  },
});

export const unlikeBlog = mutation({
  args: {
    blogId: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized: User must be logged in to unlike a blog.");
    }

    const blog = await ctx.db.get(args.blogId);
    if (!blog) {
      throw new Error("Blog not found.");
    }

    // Check if the user has not liked the blog
    if (!blog.likedBy.includes(userId)) {
      throw new Error("User has not liked this blog.");
    }

    // Remove the user from the likedBy array and decrement likesCount
    await ctx.db.patch(args.blogId, {
      likedBy: blog.likedBy.filter((id) => id !== userId),
      likesCount: blog.likesCount - 1,
    });

    return args.blogId;
  },
});

export const saveBlog = mutation({
  args: {
    blogId: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized: User must be logged in to save a blog.");
    }

    const blog = await ctx.db.get(args.blogId);
    if (!blog) {
      throw new Error("Blog not found.");
    }

    // Check if the user has already saved the blog
    if (blog.savedBy.includes(userId)) {
      throw new Error("User has already saved this blog.");
    }

    // Add the user to the savedBy array and increment savedCount
    await ctx.db.patch(args.blogId, {
      savedBy: [...blog.savedBy, userId],
      savedCount: blog.savedCount + 1,
    });

    return args.blogId;
  },
});

export const unsaveBlog = mutation({
  args: {
    blogId: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized: User must be logged in to unsave a blog.");
    }

    const blog = await ctx.db.get(args.blogId);
    if (!blog) {
      throw new Error("Blog not found.");
    }

    // Check if the user has not saved the blog
    if (!blog.savedBy.includes(userId)) {
      throw new Error("User has not saved this blog.");
    }

    // Remove the user from the savedBy array and decrement savedCount
    await ctx.db.patch(args.blogId, {
      savedBy: blog.savedBy.filter((id) => id !== userId),
      savedCount: blog.savedCount - 1,
    });

    return args.blogId;
  },
});

export const getAllPaginatedBlogs = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const blogs = await ctx.db
      .query("blogs")
      .order("desc")
      .paginate(args.paginationOpts);
    return blogs;
  },
});

export const getPaginatedUserBlogs = query({
  args: {
    userId: v.id("users"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userBlogs = await ctx.db
      .query("blogs")
      .filter((q) => q.eq(q.field("userId"), args.userId)) // Filter by userId
      .order("desc")
      .paginate(args.paginationOpts);

    return userBlogs;
  },
});

// Get paginated blogs saved by a user
export const getPaginatedSavedBlogs = query({
  args: {
    userId: v.id("users"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const savedBlogs = await ctx.db
      .query("blogs")
      .filter((q) => q.eq(q.field("savedBy"), [args.userId])) // Filter by savedBy array
      .order("desc")
      .paginate(args.paginationOpts);

    return savedBlogs;
  },
});

// Get paginated blogs liked by a user
export const getPaginatedLikedBlogs = query({
  args: {
    userId: v.id("users"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const likedBlogs = await ctx.db
      .query("blogs")
      .filter((q) => q.eq(q.field("likedBy"), [args.userId])) // Filter by likedBy array
      .order("desc")
      .paginate(args.paginationOpts);

    return likedBlogs;
  },
});
