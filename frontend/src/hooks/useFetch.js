import { useQuery } from "@tanstack/react-query";

export const useFetch = (queryKey, fetchFunction, options) => {
  const {
    data,
    error,
    isPending: loading,
    isRefetching,
    refetch,
    isRefetchError,
  } = useQuery({
    queryKey: [...queryKey],
    queryFn: () => fetchFunction(),
    ...options,
  });

  return { loading, error, data, isRefetchError, refetch, isRefetching };
};
