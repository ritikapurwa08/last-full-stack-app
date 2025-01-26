"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Edit, LoaderIcon, LucideIcon } from "lucide-react";
import React, { useState } from "react";
import { IconType } from "react-icons";
import { z } from "zod";
import {
  useFollowUserHook,
  useUnfollowUserHook,
  useUpdateUserHook,
} from "../mutation/user-mutation";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GetUserAllFollowingNumberHook,
  IsFollowingUserHook,
  useCurrentUserHook,
  useUserAllFollowersList,
} from "../query/user-query-hooks";
import { Form } from "@/components/ui/form";
import CustomInput from "@/features/form/custom-input";
import { Id } from "../../../../convex/_generated/dataModel";

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

export const FollowingButton = ({ userId }: { userId: Id<"users"> }) => {
  const {
    allFollowingNumber: followingNumber,
    isLoading: followingNumberLoading,
  } = GetUserAllFollowingNumberHook({ userId });

  const { followersList, isLoading } = useUserAllFollowersList({ userId });
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline">Following {followingNumber}</Button>
      </DialogTrigger>
      <DialogContent>
        {followersList?.map((follower) => (
          <div key={follower.id}>{follower.name}</div>
        ))}
      </DialogContent>
    </Dialog>
  );
};
