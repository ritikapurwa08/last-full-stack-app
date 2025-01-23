import React from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import Image from "next/image";

// Types that match the schema
type Blog = {
  _id: Id<"blogs">;
  userId: Id<"users">;
  title: string;
  content: string;
  customImage?: string;
  uploadedImage?: string;
  uploadedImageStorageId?: string;
  updatedAt: number;
  commentsCount: number;
  likesCount: number;
  sharesCount: number;
  isPublished: boolean;
  tags?: string[];
};

type User = {
  _id: Id<"users">;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  location?: string;
  customImage?: string;
  uploadedImage?: string;
  uploadedImageStorageId?: Id<"_storage">;
  role?: "admin" | "user" | "member";
};

type UserStats = {
  userId: Id<"users">;
  followers: number;
  following: number;
  posts: number;
  savedPosts: number;
  likedPosts: number;
  totalMessages: number;
  unreadMessages: number;
};

type UserDates = {
  userId: Id<"users">;
  joinedAt: string;
  lastActive: string;
  lastMessageAt?: string;
};

type UserPreferences = {
  userId: Id<"users">;
  showFollowers?: boolean;
  showFollowing?: boolean;
  showPosts?: boolean;
  showSavedPosts?: boolean;
  showLikedPosts?: boolean;
  showEmail?: boolean;
  showLocation?: boolean;
  showBio?: boolean;
  showJoinedAt?: boolean;
  showLastActive?: boolean;
  messagePrivacy?: "everyone" | "followers" | "none";
};

type UserContact = {
  userId: Id<"users">;
  email?: string;
  instagram?: string;
  website?: string;
  showEmail?: boolean;
  showInstagram?: boolean;
  showWebsite?: boolean;
};

// Combined profile data type
type ProfileData = {
  user: User;
  stats: UserStats;
  dates: UserDates;
  preferences: UserPreferences;
  contact: UserContact;
  blogs: Blog[];
  isCurrentUser: boolean;
  isFollowing: boolean;
};

// Mock data
const mockProfileData: ProfileData = {
  user: {
    _id: "users:123" as Id<"users">,
    name: "John Doe",
    email: "john.doe@example.com",
    image: "https://github.com/shadcn.png",
    bio: "Software engineer passionate about web development",
    location: "San Francisco, CA",
    role: "member",
  },
  stats: {
    userId: "users:123" as Id<"users">,
    followers: 1234,
    following: 567,
    posts: 42,
    savedPosts: 89,
    likedPosts: 156,
    totalMessages: 324,
    unreadMessages: 5,
  },
  dates: {
    userId: "users:123" as Id<"users">,
    joinedAt: "2023-01-15",
    lastActive: "2024-03-20",
  },
  preferences: {
    userId: "users:123" as Id<"users">,
    showFollowers: true,
    showFollowing: true,
    showPosts: true,
    showSavedPosts: true,
    showLikedPosts: true,
    showEmail: true,
    showLocation: true,
    showBio: true,
    showJoinedAt: true,
    showLastActive: true,
    messagePrivacy: "everyone",
  },
  contact: {
    userId: "users:123" as Id<"users">,
    email: "john.doe@example.com",
    instagram: "@johndoe",
    website: "https://johndoe.dev",
    showEmail: true,
    showInstagram: true,
    showWebsite: true,
  },
  blogs: [
    {
      _id: "blogs:1" as Id<"blogs">,
      userId: "users:123" as Id<"users">,
      title: "Getting Started with TypeScript",
      content:
        "TypeScript is a powerful tool for writing scalable JavaScript applications...",
      updatedAt: Date.now(),
      commentsCount: 5,
      likesCount: 12,
      sharesCount: 3,
      isPublished: true,
      tags: ["typescript", "programming"],
    },
  ],
  isCurrentUser: false,
  isFollowing: true,
};

interface ProfilePageProps {
  userId?: Id<"users">; // Optional - if not provided, show current user's profile
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userId }) => {
  // In a real application, you would fetch the profile data based on userId
  const profileData = mockProfileData;
  const {
    user,
    stats,
    dates,
    preferences,
    contact,
    blogs,
    isCurrentUser,
    isFollowing,
  } = profileData;

  return (
    <div className="max-w-4xl mx-auto py-20 px-6">
      {/* Header Section */}
      <div className="flex items-start gap-6 mb-8">
        <div className="w-32 h-32 rounded-full overflow-hidden">
          <Image
            height={100}
            width={100}
            src={user.image || "/default-avatar.png"}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            {user.role && (
              <span className="px-2 py-1 text-sm bg-gray-100 rounded-full">
                {user.role}
              </span>
            )}
          </div>

          {preferences.showBio && user.bio && (
            <p className="mt-2 text-gray-600">{user.bio}</p>
          )}

          {preferences.showLocation && user.location && (
            <p className="mt-1 text-gray-500">📍 {user.location}</p>
          )}

          {!isCurrentUser && (
            <div className="mt-4 flex gap-3">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
              <button className="px-4 py-2 bg-gray-100 rounded-lg">
                Message
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {preferences.showPosts && (
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="font-bold">{stats.posts}</div>
            <div className="text-sm text-gray-600">Posts</div>
          </div>
        )}
        {preferences.showFollowers && (
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="font-bold">{stats.followers}</div>
            <div className="text-sm text-gray-600">Followers</div>
          </div>
        )}
        {preferences.showFollowing && (
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="font-bold">{stats.following}</div>
            <div className="text-sm text-gray-600">Following</div>
          </div>
        )}
      </div>

      {/* Blogs Section */}
      {preferences.showPosts && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Posts</h2>
          <div className="grid gap-4">
            {blogs.map((blog) => (
              <div key={blog._id} className="p-4 border rounded-lg">
                <h3 className="font-bold">{blog.title}</h3>
                <p className="text-gray-600 line-clamp-2">{blog.content}</p>
                <div className="mt-2 flex gap-4 text-sm text-gray-500">
                  <span>💬 {blog.commentsCount}</span>
                  <span>❤️ {blog.likesCount}</span>
                  <span>🔄 {blog.sharesCount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Information */}
      {(contact.showEmail || contact.showInstagram || contact.showWebsite) && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Contact</h2>
          <div className="space-y-2">
            {contact.showEmail && contact.email && <p>📧 {contact.email}</p>}
            {contact.showInstagram && contact.instagram && (
              <p>📸 {contact.instagram}</p>
            )}
            {contact.showWebsite && contact.website && (
              <p>🌐 {contact.website}</p>
            )}
          </div>
        </div>
      )}

      {/* Dates Section */}
      <div className="text-sm text-gray-500">
        {preferences.showJoinedAt && (
          <p>Joined: {new Date(dates.joinedAt).toLocaleDateString()}</p>
        )}
        {preferences.showLastActive && (
          <p>Last active: {new Date(dates.lastActive).toLocaleDateString()}</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
