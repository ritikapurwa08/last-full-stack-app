import { usePaginatedQuery, useQuery } from "convex/react";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

type Blog = Doc<"blogs">;

type UsePaginatedBlogsResult = {
  results: Blog[];
  status: "CanLoadMore" | "LoadingFirstPage" | "LoadingMore" | "Exhausted";
  loadMore: (numItems: number) => void;
  isLoading: boolean;
  hasMore: boolean;
};

export const usePaginatedBlogs = (
  queryName:
    | "getPaginatedUserBlogs"
    | "getPaginatedSavedBlogs"
    | "getPaginatedLikedBlogs"
    | "getAllPaginatedBlogs",

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryArgs: Record<string, any> = {}, // Additional query arguments
  initialNumItems: number = 5
): UsePaginatedBlogsResult => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.blogs[queryName],
    { userId: queryArgs.userId }, // Ensure userId is included in queryArgs
    { initialNumItems }
  );

  const isLoading = status === "LoadingFirstPage" || status === "LoadingMore";
  const hasMore = status === "CanLoadMore";

  return {
    results: results as Blog[],
    status,
    loadMore,
    isLoading,
    hasMore,
  };
};

export type CustomCommentsDataType = Doc<"comments"> & {
  userName: string;
  userImage: string | null;
};
type UsePaginatedCommentsResult = {
  results: CustomCommentsDataType[];
  status: "CanLoadMore" | "LoadingFirstPage" | "LoadingMore" | "Exhausted";
  loadMore: (numItems: number) => void;
  isLoading: boolean;
  hasMore: boolean;
};
export const usePaginatedComments = (
  queryName: "getPaginatedComments",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryArgs: Record<string, any> = {}, // Additional query arguments
  initialNumItems: number = 5
): UsePaginatedCommentsResult => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.comments[queryName],
    { blogId: queryArgs.blogId },
    { initialNumItems }
  );

  const isLoading = status === "LoadingFirstPage" || status === "LoadingMore";
  const hasMore = status === "CanLoadMore";

  return {
    results: results as CustomCommentsDataType[],
    status,
    loadMore,
    isLoading,
    hasMore,
  };
};

export const useGetAllPaginatedBlogs = (
  initialNumItems: number = 5
): UsePaginatedBlogsResult => {
  return usePaginatedBlogs("getAllPaginatedBlogs", {}, initialNumItems);
};

export const useGetPaginatedUserBlogs = (
  initialNumItems: number = 5,
  userId: Id<"users">
): UsePaginatedBlogsResult => {
  return usePaginatedBlogs(
    "getPaginatedUserBlogs",
    { userId },
    initialNumItems
  );
};

export const useGetPaginatedSavedBlogs = (
  initialNumItems: number = 5,
  userId: Id<"users">
): UsePaginatedBlogsResult => {
  return usePaginatedBlogs(
    "getPaginatedSavedBlogs",
    { userId },
    initialNumItems
  );
};

export const useGetPaginatedLikedBlogs = (
  initialNumItems: number = 5,
  userId: Id<"users">
): UsePaginatedBlogsResult => {
  return usePaginatedBlogs(
    "getPaginatedLikedBlogs",
    { userId },
    initialNumItems
  );
};

export const useIsAlreadyLikedBlog = (blogId: Id<"blogs">) => {
  const isAlreadyLiked = useQuery(api.blogs.isAlreadyLikedBlog, { blogId });
  return isAlreadyLiked;
};

export const useIsAlreadySavedBlog = (blogId: Id<"blogs">) => {
  const isAlreadySaved = useQuery(api.blogs.isAlreadySavedBlog, { blogId });
  return isAlreadySaved;
};

export const useGetPaginatedComments = (initialNumItems: number = 5) => {
  return usePaginatedComments("getPaginatedComments", {}, initialNumItems);
};

export const useIsOwnerOfComment = (_id: Id<"comments">) => {
  const isOwnerOfComment = useQuery(api.comments.isOwnerOfComment, {
    commentId: _id,
  });
  return isOwnerOfComment;
};

export const useIsAlreadyLikedComment = (_id: Id<"comments">) => {
  const isAlreadyLiked = useQuery(api.comments.isAlreadyLikedComment, {
    commentId: _id,
  });
  return isAlreadyLiked;
};
