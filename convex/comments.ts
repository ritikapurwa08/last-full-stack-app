import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";

export const createComment = mutation({
  args: {
    blogId: v.id("blogs"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const { blogId, content } = args;
    const userId = await getAuthUserId(ctx);
    if (!userId || !blogId) {
      throw new Error("Invalid input");
    }
    const blog = await ctx.db.get(blogId);
    if (!blog) {
      throw new Error("Blog not found");
    }
    const commentId = await ctx.db.insert("comments", {
      blogId,
      userId,
      content,
      commentLikesCount: 0,
      isCommentEdited: false,
      commentLikes: [],
    });
    return commentId;
  },
});

export const getPaginatedComments = query({
  args: {
    blogId: v.id("blogs"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const { paginationOpts, blogId } = args;
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Query comments for specific blog
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_blogId", (q) => q.eq("blogId", blogId))
      .order("desc")
      .paginate(paginationOpts);

    // Get user info for each comment
    const commentsWithUser = await Promise.all(
      comments.page.map(async (comment) => {
        const user = await ctx.db.get(comment.userId);
        return {
          ...comment,
          userName: user?.name || "Anonymous",
          userImage: user?.image || null,
        };
      })
    );

    return {
      ...comments,
      page: commentsWithUser,
    };
  },
});

export const isOwnerOfComment = query({
  args: {
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const { commentId } = args;
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const comment = await ctx.db.get(commentId);
    return comment?.userId === userId;
  },
});

export const updateComment = mutation({
  args: {
    commentId: v.id("comments"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const { commentId, content } = args;
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const comment = await ctx.db.get(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }
    if (comment.userId !== userId) {
      throw new Error("Unauthorized");
    }
    await ctx.db.patch(commentId, { content });
    return commentId;
  },
});

export const removeComment = mutation({
  args: {
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const { commentId } = args;
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const comment = await ctx.db.get(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }
    if (comment.userId !== userId) {
      throw new Error("Unauthorized");
    }
    await ctx.db.delete(commentId);
    return commentId;
  },
});

export const likeComment = mutation({
  args: {
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const { commentId } = args;
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const comment = await ctx.db.get(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }
    await ctx.db.patch(commentId, {
      commentLikes: [...(comment.commentLikes || []), userId],
      commentLikesCount: (comment.commentLikesCount || 0) + 1,
    });
    return commentId;
  },
});

export const removeLikeComment = mutation({
  args: {
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const { commentId } = args;
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const comment = await ctx.db.get(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }
    await ctx.db.patch(commentId, {
      commentLikes: comment.commentLikes?.filter((id) => id !== userId),
      commentLikesCount: (comment.commentLikesCount || 0) - 1,
    });
    return commentId;
  },
});

export const isAlreadyLikedComment = query({
  args: {
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const { commentId } = args;
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const comment = await ctx.db.get(commentId);
    return comment?.commentLikes?.includes(userId);
  },
});
