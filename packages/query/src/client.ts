import {
  defaultShouldDehydrateQuery,
  isServer,
  MutationCache,
  QueryCache,
  QueryClient,
} from "@tanstack/react-query";

/**
 * Factory function that creates a new QueryClient instance with production-ready defaults.
 *
 * @remarks
 * This function configures TanStack Query with optimized settings for:
 * - **Caching Strategy**: 2-minute stale time, 10-minute garbage collection
 * - **Error Handling**: Smart retry logic that distinguishes client vs server errors
 * - **Network Awareness**: Only fetches when online, re-fetches on reconnect
 * - **SSR Support**: Dehydrates pending queries for seamless server-to-client transitions
 *
 * The configuration is designed to balance performance, reliability, and user experience
 * across both server and client environments.
 *
 * @returns A new QueryClient instance with pre-configured defaults
 *
 * @internal
 * This function is called by {@link getQueryClient} and should not be used directly.
 *
 * @example
 * ```typescript
 * // Don't call directly - use getQueryClient() instead
 * const client = makeQueryClient();
 * ```
 */
const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 2, // 2 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes

        retry: (failureCount, _error) => {
          /* if (error?.status >= 400 && error?.status < 500)
						return false; */

          return failureCount < 3;
        },
        retryDelay: (attemptIndex) =>
          Math.min(1000 * 2 ** attemptIndex, 30_000),

        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: true,
        refetchInterval: false,
        refetchIntervalInBackground: false,

        networkMode: "online",

        throwOnError: false,

        placeholderData: (previousData: unknown) => previousData,
      },
      mutations: {
        retry: (_failureCount, _error) => {
          /* if ((error as any)?.status >= 500 || !(error as any)?.status) {
						return failureCount < 2;
					} */
          return false;
        },
        retryDelay: 1000 * 2, // 2 seconds

        networkMode: "online",

        throwOnError: false,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",

        shouldDehydrateMutation: () => false,

        shouldRedactErrors: () => true,
      },
    },

    queryCache: new QueryCache({
      onError(error, query) {
        if (query.state.data !== undefined) {
          console.error("Query Error:", error);
        }
      },
    }),

    mutationCache: new MutationCache({
      onError: (error) => console.error("Mutation error:", error),
    }),
  });
};

/**
 * Singleton QueryClient instance for browser environments.
 *
 * @remarks
 * This variable holds a cached QueryClient instance that persists across component re-renders
 * in the browser. It ensures that:
 * - Query cache is preserved during React's concurrent rendering and Suspense
 * - Multiple components can share the same QueryClient without creating duplicates
 * - Server-side rendering always gets a fresh instance per request
 *
 * @internal
 * Managed automatically by {@link getQueryClient}. Do not access directly.
 */
let browserQueryClient: QueryClient | undefined;

/**
 * Returns a QueryClient instance optimized for the current environment (server or browser).
 *
 * @remarks
 * This function implements the singleton pattern for browser environments and ensures
 * proper isolation for server-side rendering:
 *
 * **Server Behavior (SSR/RSC):**
 * - Always creates a new QueryClient per request
 * - Prevents cache pollution between different users/requests
 * - Enables proper dehydration for Next.js server components
 *
 * **Browser Behavior:**
 * - Reuses a single QueryClient instance across the application lifecycle
 * - Preserves query cache during React suspense and concurrent rendering
 * - Prevents unnecessary re-initialization during hot module replacement
 *
 * This pattern is critical for Next.js App Router and React Server Components to work correctly.
 *
 * @returns A QueryClient instance - fresh on server, singleton in browser
 *
 * @example
 * ```typescript
 * // In a Server Component (Next.js App Router)
 * import { getQueryClient } from '@gb/query/client';
 * import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
 *
 * async function Page() {
 *   const queryClient = getQueryClient();
 *   await queryClient.prefetchQuery({
 *     queryKey: ['users'],
 *     queryFn: fetchUsers,
 *   });
 *
 *   return (
 *     <HydrationBoundary state={dehydrate(queryClient)}>
 *       <UsersList />
 *     </HydrationBoundary>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // In QueryProvider (Client Component)
 * "use client";
 * import { getQueryClient } from '@gb/query/client';
 * import { QueryClientProvider } from '@tanstack/react-query';
 *
 * export function QueryProvider({ children }) {
 *   const queryClient = getQueryClient();
 *
 *   return (
 *     <QueryClientProvider client={queryClient}>
 *       {children}
 *     </QueryClientProvider>
 *   );
 * }
 * ```
 *
 * @see {@link https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr | TanStack Query SSR Guide}
 */
export const getQueryClient = () => {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: make a new query client if we don't already have one
  // This is very important, so we don't re-make a new client if React
  // suspends during the initial render. This may not be needed if we
  // have a suspense boundary BELOW the creation of the query client
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
};
