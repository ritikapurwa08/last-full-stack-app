import { useCallback, useMemo, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { useMutation } from "convex/react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type MutationOpts<TArgs, TResponse> = {
  onSuccess: (data: TResponse) => void;
  onError: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

type MutationState<TResponse> = {
  data: TResponse | null;
  error: Error | null;
  status: "success" | "error" | "settled" | "pending" | null;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const useMutationHook = <TArgs extends {}, TResponse>(
  mutationFn: (args: TArgs) => Promise<TResponse>
) => {
  const [state, setState] = useState<MutationState<TResponse>>({
    data: null,
    error: null,
    status: null,
  });
  const isPending = useMemo(() => state.status === "pending", [state.status]);
  const isSuccess = useMemo(() => state.status === "success", [state.status]);
  const isError = useMemo(() => state.status === "error", [state.status]);
  const isSettled = useMemo(() => state.status === "settled", [state.status]);
  const data = useMemo(() => state.data, [state.data]);
  const mutate = useCallback(
    async (values: TArgs, options?: MutationOpts<TArgs, TResponse>) => {
      try {
        setState({ data: null, error: null, status: "pending" });

        const response = await mutationFn(values);
        setState({ data: response, error: null, status: "success" });
        options?.onSuccess?.(response);
        return response;
      } catch (error) {
        setState({ data: null, error: error as Error, status: "error" });
        options?.onError?.(error as Error);

        if (options?.throwError) {
          throw error;
        }
      } finally {
        setState((prev) => ({ ...prev, status: "settled" }));
        options?.onSettled?.();
      }
    },
    [mutationFn]
  );

  return {
    mutate,
    isPending,
    isError,
    isSuccess,
    isSettled,
    data,
    error: state.error,
  };
};

export const useCreateBlogHook = () => {
  const createBlog = useMutation(api.blogs.createBlog);
  return useMutationHook(createBlog);
};

export const useUpdateBlogHook = () => {
  const updateBlog = useMutation(api.blogs.updateBlog);
  return useMutationHook(updateBlog);
};

export const useRemoveBlogHook = () => {
  const removeBlog = useMutation(api.blogs.removeBlog);
  return useMutationHook(removeBlog);
};

export const useLikeBlogHook = () => {
  const likeBlog = useMutation(api.blogs.likeBlog);
  return useMutationHook(likeBlog);
};

export const useRemoveLikeBlogHook = () => {
  const removeLikeBlog = useMutation(api.blogs.unlikeBlog);
  return useMutationHook(removeLikeBlog);
};

export const useSaveBlogHook = () => {
  const saveBlog = useMutation(api.blogs.saveBlog);
  return useMutationHook(saveBlog);
};

export const useRemoveSaveBlogHook = () => {
  const removeSaveBlog = useMutation(api.blogs.unsaveBlog);
  return useMutationHook(removeSaveBlog);
};

export const useCreateCommentHook = () => {
  const createComment = useMutation(api.comments.createComment);
  return useMutationHook(createComment);
};

export const useUpdateCommentHook = () => {
  const updateComment = useMutation(api.comments.updateComment);
  return useMutationHook(updateComment);
};

export const useRemoveCommentHook = () => {
  const removeComment = useMutation(api.comments.removeComment);
  return useMutationHook(removeComment);
};

export const useLikeCommentHook = () => {
  const likeComment = useMutation(api.comments.likeComment);
  return useMutationHook(likeComment);
};

export const useRemoveLikeCommentHook = () => {
  const removeLikeComment = useMutation(api.comments.removeLikeComment);
  return useMutationHook(removeLikeComment);
};
