import Loading from '@/app/loading'
import Unlogin from '@/app/unlogin'
import { Wrapper } from '@/components/public'
import { SellExplanationContent } from '@/components/sell/explanation'
import { getQueryClient } from '@/lib/core/get-query-client'
import { fetchMe, userKey } from '@/lib/queries/user'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { cookies } from 'next/headers'
import { Suspense } from 'react'

type Params = Promise<{ conId: string }>

const ExplanationPage = async (props: { params: Params }) => {
  const { conId } = await props.params

  const queryClient = getQueryClient()
  const cookieStore = await cookies()
  const token = cookieStore.get('x-auth-token')?.value

  if (!token) {
    return <Unlogin />
  }

  // TODO: 기타 트러블 콘 prefetch

  await queryClient.prefetchQuery({
    queryKey: userKey.me(token),
    queryFn: fetchMe,
  })

  return (
    <Wrapper>
      <div className="flex flex-col py-2 px-4">
        <p className="text-subtitle-16-bold text-gray-900 mb-[10px]">
          문의 상세
        </p>

        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<Loading />}>
            <SellExplanationContent conId={conId} />
          </Suspense>
        </HydrationBoundary>
      </div>
    </Wrapper>
  )
}

export default ExplanationPage
