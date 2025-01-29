import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Doc, Id } from "../../../../convex/_generated/dataModel";

export const useCheckEmail = ({ email }: { email: string }) => {
  const checkEmail = useQuery(api.users.checkEmail, { email });
  const isCheckingEmail = checkEmail === undefined;
  return {
    checkEmail,
    isCheckingEmail,
  };
};

export const useCurrentUserHook = () => {
  const currentUser = useQuery(api.users.getCurrentUser);
  const isLoading = currentUser === undefined;
  return {
    currentUser,
    isLoading,
  };
};

export const useUserById = ({ userId }: { userId: Id<"users"> }) => {
  const user = useQuery(api.users.getUserById, { userId });
  const isLoading = user === undefined;
  return {
    user,
    isLoading,
  };
};

export const IsFollowingUserHook = ({
  userId,
  targetUserId,
}: {
  userId: Id<"users">;
  targetUserId: Id<"users">;
}) => {
  const isFollowing = useQuery(api.users.isFollwingUser, {
    userId,
    targetUserId,
  });

  const isLoading = isFollowing === undefined;
  return {
    isFollowing,
    isLoading,
  };
};

export type CustomUserFollowList = Doc<"users">;
type UsePaginatedUserFollowList = {
  results: CustomUserFollowList[];
  status: "CanLoadMore" | "LoadingFirstPage" | "LoadingMore" | "Exhausted";
  loadMore: (numItems: number) => void;
  isLoading: boolean;
  hasMore: boolean;
};
export const usePaginatedUsers = (
  queryName: "getUserAllFollowersList" | "getUserAllFollowingList",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryArgs: Record<string, any> = {}, // Additional query arguments
  initialNumItems: number = 5
): UsePaginatedUserFollowList => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.users[queryName],
    { userId: queryArgs.userId }, // Changed from blogId to userId
    { initialNumItems }
  );

  const isLoading = status === "LoadingFirstPage" || status === "LoadingMore";
  const hasMore = status === "CanLoadMore";

  return {
    results: results as CustomUserFollowList[],
    status,
    loadMore,
    isLoading,
    hasMore,
  };
};

export const useGetUserAllFollowersList = (
  userId: Id<"users">,
  initialNumItems: number = 5
) => {
  return usePaginatedUsers(
    "getUserAllFollowersList",
    { userId },
    initialNumItems
  );
};

export const useGetUserAllFollowingList = (
  userId: Id<"users">,
  initialNumItems: number = 5
) => {
  return usePaginatedUsers(
    "getUserAllFollowingList",
    { userId },
    initialNumItems
  );
};
