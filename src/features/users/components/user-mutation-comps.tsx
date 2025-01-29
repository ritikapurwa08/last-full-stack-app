"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, LoaderIcon, LucideIcon, Settings2Icon } from "lucide-react";
import React, { useState } from "react";
import { IconType } from "react-icons";
import { z } from "zod";
import {
  useAddUserDetailsHook,
  useFollowUserHook,
  useUnfollowUserHook,
  useUpdateUserHook,
  useUpdateUserPreferencesHook,
} from "../mutation/user-mutation";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IsFollowingUserHook,
  useCurrentUserHook,
  useGetUserAllFollowersList,
  useGetUserAllFollowingList,
} from "../query/user-query-hooks";
import { Form } from "@/components/ui/form";
import CustomInput from "@/features/form/custom-input";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { format } from "date-fns";
import { formatDistanceToNow } from "date-fns";

import { Skeleton } from "@/components/ui/skeleton";
import {
  FaUserCircle,
  FaUserFriends,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa"; // Example icons from react-icons
import { Loader2 } from "lucide-react"; // Loading spinner from lucide-react
import Image from "next/image";
import CustomTextarea from "@/features/form/custom-textarea";
import SubmitButton from "@/features/form/submit-button";
import CustomSwitch from "@/features/form/custom-switch";

type UserMutationDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  openButtonName: string;
  openButtonIcon: IconType | LucideIcon;
  showOpenButtonIconOnly?: boolean;
  dialogFooterOpenButtonName?: string;
  dialogFooterOpenButtonIcon?: IconType | LucideIcon;
  dialogFooterSubmitButtonName?: string;
  dialogFooterSubmitButtonIcon?: IconType | LucideIcon;
  children: React.ReactNode;
};

type UserListProps = {
  users: Doc<"users">[];
  hasMore: boolean;
  isLoading: boolean;
  loadMore: (numItems: number) => void;
  showPlaceholder?: boolean;
  targetUserId: Id<"users">;
};

const UserMutationDialog = ({
  isOpen,
  setIsOpen,
  openButtonName,
  openButtonIcon: OpenButtonIcon,
  showOpenButtonIconOnly,

  children,
}: UserMutationDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          size={showOpenButtonIconOnly ? "icon" : "sm"}
        >
          <span>
            <OpenButtonIcon className="size-4" />
          </span>
          {!showOpenButtonIconOnly && openButtonName}
        </Button>
      </DialogTrigger>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};

const UpdateUserZodDetails = z.object({
  bio: z.string().optional(),
  image: z.string().optional(),
  instagram: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
});

type UpdateUserZodDetails = z.infer<typeof UpdateUserZodDetails>;

export const UpdateUserDetails = () => {
  const { mutate, isPending } = useUpdateUserHook();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const { currentUser } = useCurrentUserHook();

  const form = useForm<UpdateUserZodDetails>({
    resolver: zodResolver(UpdateUserZodDetails),
    defaultValues: {
      bio: currentUser?.bio || "",
      image: currentUser?.image || "",
      instagram: currentUser?.instagram || "",
      location: currentUser?.location || "",
      website: currentUser?.website || "",
    },
  });

  const handleUpdateUser = (values: UpdateUserZodDetails) => {
    mutate(values, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "User details updated successfully",
          variant: "default",
        });
        setOpen(false); // Close the dialog after successful update
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to update user details",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <UserMutationDialog
      isOpen={open}
      setIsOpen={setOpen}
      openButtonName="Edit Profile"
      openButtonIcon={Edit} // Assuming Edit is imported from lucide-react
      showOpenButtonIconOnly={false}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleUpdateUser)}
          className="space-y-8 p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-full">
              <CustomInput
                control={form.control}
                label="Bio"
                name="bio"
                placeholder="Tell us about yourself..."
                className="flex-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                labelClassName="!-translate-y-0 !static !peer-placeholder-shown:-translate-y-0 text-gray-600 dark:text-gray-300"
                icon={() => (
                  <span className="text-indigo-500 dark:text-indigo-400">
                    ✏️
                  </span>
                )}
              />
            </div>

            <div className="space-y-6">
              <CustomInput
                control={form.control}
                label="Profile Image URL"
                name="image"
                placeholder="Paste your image URL"
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                labelClassName="!-translate-y-0 !static !peer-placeholder-shown:-translate-y-0 text-gray-600 dark:text-gray-300"
                icon={() => (
                  <span className="text-pink-500 dark:text-pink-400">🖼️</span>
                )}
              />

              <CustomInput
                control={form.control}
                label="Location"
                name="location"
                placeholder="Where are you based?"
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                labelClassName="!-translate-y-0 !static !peer-placeholder-shown:-translate-y-0 text-gray-600 dark:text-gray-300"
                icon={() => (
                  <span className="text-green-500 dark:text-green-400">📍</span>
                )}
              />
            </div>

            <div className="space-y-6">
              <CustomInput
                control={form.control}
                label="Instagram"
                name="instagram"
                placeholder="@yourusername"
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                labelClassName="!-translate-y-0 !static !peer-placeholder-shown:-translate-y-0 text-gray-600 dark:text-gray-300"
                icon={() => (
                  <span className="text-purple-500 dark:text-purple-400">
                    📸
                  </span>
                )}
              />

              <CustomInput
                control={form.control}
                label="Website"
                name="website"
                placeholder="https://your-website.com"
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                labelClassName="!-translate-y-0 !static !peer-placeholder-shown:-translate-y-0 text-gray-600 dark:text-gray-300"
                icon={() => (
                  <span className="text-blue-500 dark:text-blue-400">🌐</span>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="px-6 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="px-6 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white transition-all duration-300 transform hover:scale-105"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⚡</span> Updating...
                </span>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </UserMutationDialog>
  );
};

export const FollowButton = ({
  userId,
  anotherUserId,
}: {
  userId: Id<"users">;
  anotherUserId: Id<"users">;
}) => {
  const { mutate: followUser, isPending: followUserLoading } =
    useFollowUserHook();
  const { mutate: unfollowUser, isPending: unfollowUserLoading } =
    useUnfollowUserHook();
  const { isFollowing, isLoading: isFollowingLoading } = IsFollowingUserHook({
    targetUserId: anotherUserId,
    userId,
  });
  const { toast } = useToast();
  const LoadingAction =
    followUserLoading || unfollowUserLoading || isFollowingLoading;

  const handleFollowAction = () => {
    if (isFollowing) {
      unfollowUser(
        {
          userIdToUnfollow: anotherUserId,
        },
        {
          onSuccess() {
            toast({
              title: "Success",
              description: "User unfollowed successfully",
              variant: "default",
            });
          },
          onError(error) {
            toast({
              title: "Error",
              description: error.message || "Failed to unfollow user",
              variant: "destructive",
            });
          },
        }
      );
    } else {
      followUser(
        {
          userIdToFollow: anotherUserId,
        },
        {
          onSuccess() {
            toast({
              title: "Success",
              description: "User followed successfully",
              variant: "default",
            });
          },
          onError(error) {
            toast({
              title: "Error",
              description: error.message || "Failed to follow user",
              variant: "destructive",
            });
          },
        }
      );
    }
  };

  if (userId === anotherUserId) {
    return null;
  }

  return (
    <Button
      onClick={handleFollowAction}
      disabled={LoadingAction}
      variant="outline"
      className="px-4 py-2 w-fit"
    >
      {LoadingAction ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin">
            <LoaderIcon className="size-4" />
          </span>{" "}
          Loading...
        </span>
      ) : isFollowing ? (
        "Unfollow"
      ) : (
        "Follow"
      )}
    </Button>
  );
};

const UserList = ({
  users,
  hasMore,
  isLoading,
  loadMore,
  showPlaceholder,
  targetUserId,
}: UserListProps) => {
  if (!users?.length && !isLoading && !showPlaceholder) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <FaUserCircle className="h-10 w-10 mx-auto mb-2" />
        <p>No users found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {(isLoading || showPlaceholder) &&
        !users?.length &&
        Array(3)
          .fill(null)
          .map((_, index) => (
            <div
              key={`placeholder-${index}`}
              className="flex items-center space-x-4"
            >
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[180px]" />
                <Skeleton className="h-4 w-[250px]" />
              </div>
            </div>
          ))}

      {users?.map(
        ({
          _creationTime,
          _id,
          customImage,
          followersCount,
          followingCount,
          lastActive,
          name,
          role,
          imagePreference,
          uploadedImageUrl,
        }) => {
          const userProfile =
            imagePreference === "custom" ? customImage : uploadedImageUrl;

          const formattedCreationTime = format(
            new Date(_creationTime),
            "MMMM dd, yyyy"
          );

          return (
            <div key={_id} className="flex items-center space-x-4">
              <Image
                src={userProfile!}
                alt={name || "User Avatar"}
                width={24}
                height={24}
                className="h-12 w-12 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder-avatar.png";
                }}
              />

              <div className="space-y-1 flex-1">
                <p className="text-sm font-medium leading-none">
                  {name || "Unknown User"}
                </p>
                <div className="text-sm text-muted-foreground">
                  {role && (
                    <span className="mr-2 flex items-center">
                      <FaUserCircle className="mr-1" />
                      {role}
                    </span>
                  )}
                  {followersCount !== undefined && (
                    <span className="mr-2 flex items-center">
                      <FaUserFriends className="mr-1" />
                      {followersCount} Followers
                    </span>
                  )}
                  {followingCount !== undefined && (
                    <span className="mr-2 flex items-center">
                      <FaUserFriends className="mr-1 rotate-180" />
                      {followingCount} Following
                    </span>
                  )}
                  {lastActive && (
                    <span className="mr-2 flex items-center">
                      <FaClock className="mr-1" />
                      Last Active:{" "}
                      {formatDistanceToNow(new Date(lastActive), {
                        addSuffix: true,
                      })}
                    </span>
                  )}

                  <div>
                    <FollowButton userId={targetUserId} anotherUserId={_id} />
                  </div>
                  <span className="mr-2 flex items-center">
                    <FaCalendarAlt className="mr-1" />
                    Joined: {formattedCreationTime}
                  </span>
                </div>
              </div>
            </div>
          );
        }
      )}

      {hasMore && (
        <div className="flex justify-center">
          <Button
            onClick={() => loadMore?.(10)}
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export const FollowingButton = ({
  userId,
  followingCount,
}: {
  userId: Id<"users">;
  followingCount?: number;
}) => {
  const {
    hasMore,
    isLoading,
    loadMore,
    results: followingUsers,
  } = useGetUserAllFollowingList(userId, 10);

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline">
          Following
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {followingCount && followingCount > 0 ? followingCount : 0}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[500px] h-full overflow-y-auto">
        <UserList
          targetUserId={userId}
          users={followingUsers}
          hasMore={hasMore}
          isLoading={isLoading}
          loadMore={loadMore}
          showPlaceholder={true}
        />
      </DialogContent>
    </Dialog>
  );
};
export const FollowerButton = ({
  userId,
  followersCount,
}: {
  userId: Id<"users">;
  followersCount?: number;
}) => {
  const {
    results: followersUsers,
    hasMore: followersHasMore,
    loadMore: loadMoreFollowers,
    isLoading: isLoadingFollowers,
  } = useGetUserAllFollowersList(userId, 10);

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline">
          followers
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {followersCount && followersCount > 0 ? followersCount : 0}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="text-white">
        <UserList
          targetUserId={userId}
          users={followersUsers}
          hasMore={followersHasMore}
          isLoading={isLoadingFollowers}
          loadMore={loadMoreFollowers}
          showPlaceholder={true}
        />
      </DialogContent>
    </Dialog>
  );
};

type AddUserDetailsProps = {
  userId: Id<"users">;
  name?: string;
  bio?: string;
  location?: string;
  instagram?: string;
  website?: string;
};

export const AddUserDetails = ({
  userId,
  name,
  bio,
  location,
  instagram,
  website,
}: AddUserDetailsProps) => {
  const AddDetailsSchema = z.object({
    name: z.string().optional(),
    bio: z.string().optional(),
    location: z.string().optional(),
    instagram: z.string().optional(),
    website: z.string().optional(),
  });

  const { toast } = useToast();

  type AddDetailsSchema = z.infer<typeof AddDetailsSchema>;

  const form = useForm<AddDetailsSchema>({
    resolver: zodResolver(AddDetailsSchema),
    defaultValues: {
      name: name || "",
      bio: bio || "",
      location: location || "",
      instagram: instagram || "",
      website: website || "",
    },
  });

  const { mutate: addUserDetails, isPending: isAddingUserDetails } =
    useAddUserDetailsHook();

  const handleAddUserDetails = (values: AddDetailsSchema) => {
    addUserDetails(
      {
        ...values,
        userId: userId,
      },
      {
        onSuccess() {
          toast({
            title: "Success",
            description: "User details updated successfully",
            variant: "default",
          });
        },
        onError(error) {
          toast({
            title: "Error",
            description: error.message || "Failed to update user details",
            variant: "destructive",
            duration: 100000,
          });
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleAddUserDetails)}>
        <CustomInput
          control={form.control}
          name="name"
          label="Name"
          placeholder="Enter your name"
          className="text-white"
        />
        <CustomTextarea
          control={form.control}
          name="bio"
          label="Bio"
          className="text-white"
          placeholder="Enter your bio"
        />

        <CustomInput
          control={form.control}
          name="instagram"
          label="Instagram"
          className="text-white"
          placeholder="Enter your instagram"
        />
        <CustomInput
          control={form.control}
          name="website"
          label="Website"
          placeholder="Enter your website"
          className="text-white"
        />
        <CustomInput
          control={form.control}
          name="location"
          label="Location"
          placeholder="Enter your location"
          className="text-white"
        />

        <SubmitButton
          isLoading={isAddingUserDetails}
          disabled={isAddingUserDetails}
        >
          {isAddingUserDetails ? "Saving..." : "Save Changes"}
        </SubmitButton>
      </form>
    </Form>
  );
};

type SettingDialogProps = {
  userId: Id<"users">;
  showEmail: boolean;
  showInstagram: boolean;
  showWebsite: boolean;
  showFollowers: boolean;
  showFollowing: boolean;
  showPosts: boolean;
  showSavedPosts: boolean;
  showLikedPosts: boolean;
  showLocation: boolean;
  showBio: boolean;
  showJoinedAt: boolean;
  showLastActive: boolean;
};
export const SettingDialog = ({
  userId,
  showBio,
  showEmail,
  showFollowers,
  showInstagram,
  showWebsite,
  showPosts,
  showSavedPosts,
  showLikedPosts,
  showLocation,
  showJoinedAt,
  showLastActive,
}: SettingDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const SettingPreferenceSchema = z.object({
    showEmail: z.boolean().optional(),
    showInstagram: z.boolean().optional(),
    showWebsite: z.boolean().optional(),
    showFollowers: z.boolean().optional(),
    showFollowing: z.boolean().optional(),
    showPosts: z.boolean().optional(),
    showSavedPosts: z.boolean().optional(),
    showLikedPosts: z.boolean().optional(),
    showLocation: z.boolean().optional(),
    showBio: z.boolean().optional(),
    showJoinedAt: z.boolean().optional(),
    showLastActive: z.boolean().optional(),
  });
  type SettingPreferenceSchema = z.infer<typeof SettingPreferenceSchema>;

  const form = useForm<SettingPreferenceSchema>({
    resolver: zodResolver(SettingPreferenceSchema),
    defaultValues: {
      showEmail: showEmail,
      showBio: showBio,
      showFollowers: showFollowers,
      showInstagram: showInstagram,
      showWebsite: showWebsite,
      showPosts: showPosts,
      showSavedPosts: showSavedPosts,
      showLikedPosts: showLikedPosts,
      showLocation: showLocation,
      showJoinedAt: showJoinedAt,
      showLastActive: showLastActive,
    },
  });

  const { mutate: updateUserSetting, isPending: isUpdatingUserSetting } =
    useUpdateUserPreferencesHook();

  const handleUpdateUserSetting = (values: SettingPreferenceSchema) => {
    updateUserSetting(
      {
        ...values,
        userId: userId,
      },
      {
        onSuccess() {
          toast({
            title: "Success",
            description: "User settings updated successfully",
            variant: "default",
          });
          setOpen(false);
        },
        onError(error) {
          toast({
            title: "Error",
            description: error.message || "Failed to update user settings",
            variant: "destructive",
            duration: 100000,
          });
          setOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings2Icon className="" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
          <DialogDescription>Update your profile settings</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleUpdateUserSetting)}>
            <CustomSwitch
              control={form.control}
              name="showEmail"
              label="Show Email"
              className="text-white"
            />
            <CustomSwitch
              control={form.control}
              name="showInstagram"
              label="Show Instagram"
              className="text-white"
            />
            <CustomSwitch
              control={form.control}
              name="showWebsite"
              label="Show Website"
              className="text-white"
            />
            <CustomSwitch
              control={form.control}
              name="showFollowers"
              label="Show Followers"
              className="text-white"
            />
            <CustomSwitch
              control={form.control}
              name="showFollowing"
              label="Show Following"
              className="text-white"
            />
            <CustomSwitch
              control={form.control}
              name="showPosts"
              label="Show Posts"
              className="text-white"
            />
            <CustomSwitch
              control={form.control}
              name="showSavedPosts"
              label="Show Saved Posts"
              className="text-white"
            />
            <CustomSwitch
              control={form.control}
              name="showLikedPosts"
              label="Show Liked Posts"
              className="text-white"
            />
            <CustomSwitch
              control={form.control}
              name="showLocation"
              label="Show Location"
              className="text-white"
            />
            <CustomSwitch
              control={form.control}
              name="showJoinedAt"
              label="Show Joined At"
              className="text-white"
            />
            <CustomSwitch
              control={form.control}
              name="showLastActive"
              label="Show Last Active"
              className="text-white"
            />

            <SubmitButton
              isLoading={isUpdatingUserSetting}
              disabled={isUpdatingUserSetting}
            >
              {isUpdatingUserSetting ? "Saving..." : "Save Changes"}
            </SubmitButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

import {
  FaCheckCircle,
  FaInstagram,
  FaLink,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { BiBookContent } from "react-icons/bi";
import LoadingBlogCard, {
  BlogCard,
} from "@/features/blogs/component/blog-page";
import {
  useGetPaginatedSavedBlogs,
  useGetPaginatedUserBlogs,
} from "@/features/blogs/queries/blog-query-hooks";

type ShowUserDetailsType = {
  userId: Id<"users">;
  showEmail: boolean;
  showInstagram: boolean;
  showWebsite: boolean;
  showBio: boolean;
  showJoinedAt: boolean;
  showLastActive: boolean;
  lastActive: string;
  email: string;
  instagram: string;
  website: string;
  location?: string;
  bio?: string;
  joinedAt: number;
};

const formatLastActive = (lastActive: string) => {
  const now = new Date();
  const lastActiveDate = new Date(lastActive);
  const diffInSeconds = Math.floor(
    (now.getTime() - lastActiveDate.getTime()) / 1000
  );

  if (diffInSeconds < 60) {
    return "Just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  return `on ${lastActiveDate.toLocaleDateString()}`;
};

export const ShowUserDetails = ({
  showEmail,
  showInstagram,
  showWebsite,
  showBio,
  showJoinedAt,
  showLastActive,
  lastActive,
  email,
  instagram,
  website,
  location,
  bio,
  joinedAt,
}: ShowUserDetailsType) => {
  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-md">
      {/* Email */}
      {showEmail && email && (
        <div className="flex items-center mb-4">
          <FaEnvelope className="text-blue-500 mr-3" size={20} />
          <a href={`mailto:${email}`} className="hover:underline text-blue-400">
            {email}
          </a>
          <FaCheckCircle className="text-green-500 ml-2" size={16} />
        </div>
      )}

      {/* Instagram */}
      {showInstagram && instagram && (
        <div className="flex items-center mb-4">
          <FaInstagram className="text-pink-500 mr-3" size={22} />
          <a
            href={`https://www.instagram.com/${instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-pink-400"
          >
            @{instagram}
          </a>
          <FaCheckCircle className="text-green-500 ml-2" size={16} />
        </div>
      )}

      {/* Website */}
      {showWebsite && website && (
        <div className="flex items-center mb-4">
          <FaLink className="text-purple-500 mr-3" size={20} />
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-purple-400"
          >
            {website}
          </a>
          <FaCheckCircle className="text-green-500 ml-2" size={16} />
        </div>
      )}

      {/* Bio */}
      {showBio && bio && (
        <div className="flex items-center mb-4">
          <BiBookContent className="text-gray-400 mr-3" size={22} />
          <p className="text-gray-300">{bio}</p>
        </div>
      )}

      {/* Location */}
      {location && (
        <div className="flex items-center mb-4">
          <FaMapMarkerAlt className="text-red-500 mr-3" size={20} />
          <p className="text-gray-300">{location}</p>
        </div>
      )}

      {/* Joined At */}
      {showJoinedAt && joinedAt && (
        <div className="flex items-center mb-4">
          <FaCalendarAlt className="text-yellow-500 mr-3" size={18} />
          <p className="text-gray-300">Joined</p>
        </div>
      )}

      {/* Last Active */}
      {showLastActive && lastActive && (
        <div className="flex items-center">
          <FaClock className="text-green-400 mr-3" size={18} />
          <p className="text-gray-300">
            Last active {formatLastActive(lastActive)}
          </p>
        </div>
      )}
    </div>
  );
};

type ShowBlogSectionCardType = {
  results: Doc<"blogs">[];
  hasMore: boolean;
  isLoading: boolean;
  loadMore: (numItems: number) => void;
  sectionTitle: string;
  emptyMessage: string;
};

export const ShowBlogSectionCard = ({
  results,
  hasMore,
  isLoading,
  loadMore,
  sectionTitle,
  emptyMessage,
}: ShowBlogSectionCardType) => {
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-4">{sectionTitle}</h2>

      {/* Show loading cards if loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <LoadingBlogCard />
          <LoadingBlogCard />
          <LoadingBlogCard />
        </div>
      )}

      {/* Show message if no results and not loading */}
      {!isLoading && results.length === 0 && (
        <div className="text-gray-500 text-center">{emptyMessage}</div>
      )}

      {/* Show blog cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>

      {/* Load more button */}
      {hasMore && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={() => loadMore(10)} // Load 10 more items
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
};

export const ShowPostSection = ({ userId }: { userId: Id<"users"> }) => {
  const {
    hasMore: hasMoreLiked,
    isLoading: isLoadingLiked,
    loadMore: loadMoreLiked,
    results: likedBlogs,
  } = useGetPaginatedUserBlogs(10, userId);
  const {
    hasMore: hasMoreSaved,
    isLoading: isLoadingSaved,
    loadMore: loadMoreSaved,
    results: savedBlogs,
  } = useGetPaginatedSavedBlogs(10, userId);
  const {
    hasMore: hasMoreUserBlogs,
    isLoading: isLoadingUserBlogs,
    loadMore: loadMoreUserBlogs,
    results: userBlogs,
  } = useGetPaginatedUserBlogs(10, userId);

  return (
    <div className="container mx-auto px-4">
      <ShowBlogSectionCard
        results={userBlogs}
        hasMore={hasMoreUserBlogs}
        isLoading={isLoadingUserBlogs}
        loadMore={loadMoreUserBlogs}
        sectionTitle="Your Posts"
        emptyMessage="You haven't created any posts yet."
      />

      <ShowBlogSectionCard
        results={likedBlogs}
        hasMore={hasMoreLiked}
        isLoading={isLoadingLiked}
        loadMore={loadMoreLiked}
        sectionTitle="Liked Posts"
        emptyMessage="You haven't liked any posts yet."
      />

      <ShowBlogSectionCard
        results={savedBlogs}
        hasMore={hasMoreSaved}
        isLoading={isLoadingSaved}
        loadMore={loadMoreSaved}
        sectionTitle="Saved Posts"
        emptyMessage="You haven't saved any posts yet."
      />
    </div>
  );
};
