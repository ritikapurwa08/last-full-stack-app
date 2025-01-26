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
  const isFollowing = useQuery(api.blogInteractions.isFollowingUser, {
    userId,
    targetUserId,
  });

  const isLoading = isFollowing === undefined;
  return {
    isFollowing,
    isLoading,
  };
};

export const GetUserAllFollowingNumberHook = ({
  userId,
}: {
  userId: Id<"users">;
}) => {
  const allFollowingNumber = useQuery(
    api.blogInteractions.getUserAllFollowing,
    { userId }
  );
  const isLoading = allFollowingNumber === undefined;
  return {
    allFollowingNumber,
    isLoading,
  };
};

export const GetUserAllFollowersNumberHook = ({
  userId,
}: {
  userId: Id<"users">;
}) => {
  const allFollowersNumber = useQuery(
    api.blogInteractions.getUserAllFollowers,
    { userId }
  );
  const isLoading = allFollowersNumber === undefined;
  return {
    allFollowersNumber,
    isLoading,
  };
};

type UsePaginatedBlogsResult = {
  results: [];
  status: "CanLoadMore" | "LoadingFirstPage" | "LoadingMore" | "Exhausted";
  loadMore: (numItems: number) => void;
  isLoading: boolean;
  hasMore: boolean;
};

export const usePaginatedBlogs = (
  queryName: "getPaginatedUserLikedBlogs",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryArgs: Record<string, any> = {}, // Additional query arguments
  initialNumItems: number = 5
): UsePaginatedBlogsResult => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.blogInteractions[queryName],
    { userId: queryArgs.userId }, // Pass queryArgs to the query
    { initialNumItems }
  );

  const isLoading = status === "LoadingFirstPage" || status === "LoadingMore";
  const hasMore = status === "CanLoadMore";

  return {
    results: results as [],
    status,
    loadMore,
    isLoading,
    hasMore,
  };
};
export const useUserAllFollowersList = ({
  userId,
}: {
  userId: Id<"users">;
}) => {
  const followersList = useQuery(api.users.getUserAllFollowersList, {
    userId,
    paginationOpts: {
      numItems: 10,
      cursor: null,
    },
  });
  const isLoading = followersList === undefined;
  return {
    followersList,
    isLoading,
  };
};
