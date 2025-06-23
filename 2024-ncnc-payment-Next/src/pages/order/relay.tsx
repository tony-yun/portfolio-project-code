import { Loading, Page } from '@components/common'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'

const OrderRelay: NextPage = () => {
  const router = useRouter()

  return (
    <Page full header={{ router }}>
      <Loading
        title="결제중입니다."
        subTitle="최대 1분 정도 소요될 수 있습니다."
      />
    </Page>
  )
}

export default OrderRelay
