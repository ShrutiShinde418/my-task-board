import { useMutation } from "@tanstack/react-query";

export const useMutationHandler = (
  mutationFn,
  mutationKey,
  onSuccess,
  onError,
) => {
  const { data, error, isPending, mutate, isSuccess } = useMutation({
    mutationFn,
    mutationKey,
    onSuccess,
    onError,
  });

  return { data, error, isPending, mutate, isSuccess };
};
