"use client";

import {
  useMutation,
  useQueryClient,
  type QueryKey,
  type UseMutationOptions,
} from "@tanstack/react-query";

interface OptimisticConfig<TData, TVariables, TContext> {
  queryKey: QueryKey;
  updateFn: (current: TData | undefined, variables: TVariables) => TData;
  onSuccess?: UseMutationOptions<TData, Error, TVariables, TContext>["onSuccess"];
  onError?: UseMutationOptions<TData, Error, TVariables, TContext>["onError"];
}

export function useOptimisticMutation<TData, TVariables, TContext = { previous?: TData }>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  config: OptimisticConfig<TData, TVariables, TContext>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: config.queryKey });
      const previous = queryClient.getQueryData<TData>(config.queryKey);
      queryClient.setQueryData(config.queryKey, config.updateFn(previous, variables));
      return { previous } as TContext;
    },
    onError: (error, variables, context, mutationContext) => {
      const ctx = context as { previous?: TData } | undefined;
      if (ctx?.previous !== undefined) {
        queryClient.setQueryData(config.queryKey, ctx.previous);
      }
      config.onError?.(error, variables, context, mutationContext);
    },
    onSuccess: config.onSuccess,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: config.queryKey });
    },
  });
}
