import Loading from '@/app/loading'
import { Wrapper } from '@/components/public'
import { SellExtraTroubleContent } from '@/components/sell/extra-trouble'
import { getQueryClient } from '@/lib/core/get-query-client'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { Suspense } from 'react'

type Params = Promise<{ conId: string }>

const ExtraTrouble = async (props: { params: Params }) => {
  const { conId } = await props.params

  const queryClient = getQueryClient()

  return (
    <Wrapper>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<Loading />}>
          <SellExtraTroubleContent conId={conId} />
        </Suspense>
      </HydrationBoundary>
    </Wrapper>
  )
}

export default ExtraTrouble
