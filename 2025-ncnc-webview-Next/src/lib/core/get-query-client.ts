import {
  defaultShouldDehydrateQuery,
  isServer,
  QueryClient,
} from '@tanstack/react-query'

const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: N * 1000,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
        shouldRedactErrors: () => {
          return false
        },
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

export const getQueryClient = () => {
  if (isServer) {
    return makeQueryClient()
  }

  if (!browserQueryClient) browserQueryClient = makeQueryClient()

  return browserQueryClient
}
