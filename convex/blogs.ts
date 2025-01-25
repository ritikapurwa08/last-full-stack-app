import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";

export const createBlog = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    customImage: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
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

export const getPaginatedAllBlogs = query({
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

export const likeBlog = mutation({
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
    const blogId = await ctx.db.patch(args.blogId, {
      likesCount: blog.likesCount + 1,
      likes: blog.likes ? [...blog.likes, userId] : [userId],
    });
    return blogId;
  },
});

export const saveBlog = mutation({
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
    const blogId = await ctx.db.patch(args.blogId, {
      savedCount: blog.savedCount + 1,
      saved: blog.saved ? [...blog.saved, userId] : [userId],
    });
    return blogId;
  },
});

export const removeSaveBlog = mutation({
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
    const blogId = await ctx.db.patch(args.blogId, {
      savedCount: blog.savedCount - 1,
      saved: blog.saved ? blog.saved.filter((id) => id !== userId) : [],
    });
    return blogId;
  },
});

export const removeLikeBlog = mutation({
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
    const blogId = await ctx.db.patch(args.blogId, {
      likesCount: blog.likesCount - 1,
      likes: blog.likes ? blog.likes.filter((id) => id !== userId) : [],
    });
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
      throw new Error("Unauthorized");
    }
    const blog = await ctx.db.get(args.blogId);
    if (!blog) {
      throw new Error("Blog not found");
    }
    return blog.likes ? blog.likes.includes(userId) : false;
  },
});

export const isAlreadySavedBlog = query({
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
    return blog.saved ? blog.saved.includes(userId) : false;
  },
});
