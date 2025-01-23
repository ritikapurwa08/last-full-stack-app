import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // Core user information
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    customImage: v.optional(v.string()),
    uploadedImage: v.optional(v.string()),
    uploadedImageStorageId: v.optional(v.id("_storage")),
    role: v.optional(
      v.union(v.literal("admin"), v.literal("user"), v.literal("member"))
    ),
  })
    .index("by_email", ["email"])
    .index("by_name", ["name"])
    .index("by_role", ["role"]),

  // User statistics
  userStats: defineTable({
    userId: v.id("users"),
    followers: v.number(),
    following: v.number(),
    posts: v.number(),
    savedPosts: v.number(),
    likedPosts: v.number(),
    totalMessages: v.number(),
    unreadMessages: v.number(),
  }).index("by_userId", ["userId"]),

  // User relationships
  userRelationships: defineTable({
    userId: v.id("users"),
    followerId: v.id("users"),
    type: v.string(), // "following" or "follower"
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_followerId", ["followerId"])
    .index("by_both", ["userId", "followerId"]),

  // User activity dates
  userDates: defineTable({
    userId: v.id("users"),
    joinedAt: v.string(),
    lastActive: v.string(),
    lastMessageAt: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_lastActive", ["lastActive"]),

  // User preferences
  userPreferences: defineTable({
    userId: v.id("users"),
    showFollowers: v.optional(v.boolean()),
    showFollowing: v.optional(v.boolean()),
    showPosts: v.optional(v.boolean()),
    showSavedPosts: v.optional(v.boolean()),
    showLikedPosts: v.optional(v.boolean()),
    showEmail: v.optional(v.boolean()),
    showLocation: v.optional(v.boolean()),
    showBio: v.optional(v.boolean()),
    showJoinedAt: v.optional(v.boolean()),
    showLastActive: v.optional(v.boolean()),
    messagePrivacy: v.optional(
      v.union(v.literal("everyone"), v.literal("followers"), v.literal("none"))
    ),
  }).index("by_userId", ["userId"]),

  // User contact information
  userContact: defineTable({
    userId: v.id("users"),
    email: v.optional(v.string()),
    instagram: v.optional(v.string()),
    website: v.optional(v.string()),
    showEmail: v.optional(v.boolean()),
    showInstagram: v.optional(v.boolean()),
    showWebsite: v.optional(v.boolean()),
  }).index("by_userId", ["userId"]),

  // Blogs
  blogs: defineTable({
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
    customImage: v.optional(v.string()),
    uploadedImage: v.optional(v.string()),
    uploadedImageStorageId: v.optional(v.string()),
    updatedAt: v.optional(v.number()),
    likesCount: v.number(),
    commentsCount: v.number(),
    savedCount: v.number(),
    tags: v.optional(v.array(v.string())),
  })
    .index("by_userId", ["userId"])
    .index("by_updatedAt", ["updatedAt"])
    .index("by_tags", ["tags"]),

  // Blog interactions (likes, saves)
  blogInteractions: defineTable({
    userId: v.id("users"),
    blogId: v.id("blogs"),
    type: v.string(), // "save" or "like"
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_blogId", ["blogId"])
    .index("by_both", ["userId", "blogId"]),

  // Blog comments
  comments: defineTable({
    blogId: v.id("blogs"),
    userId: v.id("users"),
    content: v.string(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    parentCommentId: v.optional(v.id("comments")), // For nested comments
    likesCount: v.number(),
    isEdited: v.boolean(),
  })
    .index("by_blogId", ["blogId"])
    .index("by_userId", ["userId"])
    .index("by_parent", ["parentCommentId"]),

  // Comment interactions (likes)
  commentInteractions: defineTable({
    userId: v.id("users"),
    commentId: v.id("comments"),
    type: v.string(), // "like"
    createdAt: v.number(),
  })
    .index("by_commentId", ["commentId"])
    .index("by_userId", ["userId"]),

  // Chat rooms (for 1:1 or group chats)
  chatRooms: defineTable({
    name: v.optional(v.string()), // For group chats
    type: v.union(v.literal("direct"), v.literal("group")),
    participantIds: v.array(v.id("users")),
    lastMessageAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_participants", ["participantIds"])
    .index("by_lastMessageAt", ["lastMessageAt"]),

  // Messages
  messages: defineTable({
    chatRoomId: v.id("chatRooms"),
    senderId: v.id("users"),
    content: v.string(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    isEdited: v.boolean(),
    attachments: v.optional(v.array(v.string())),
    readBy: v.array(v.id("users")),
  })
    .index("by_chatRoom", ["chatRoomId"])
    .index("by_sender", ["senderId"])
    .index("by_createdAt", ["createdAt"]),

  // Message reactions
  messageReactions: defineTable({
    messageId: v.id("messages"),
    userId: v.id("users"),
    reaction: v.string(), // emoji or reaction type
    createdAt: v.number(),
  })
    .index("by_messageId", ["messageId"])
    .index("by_userId", ["userId"]),
});
