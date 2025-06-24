'use client'

import { Header, NdsButton } from '@/components'
import { useWebViewMessage } from '@/lib/hooks/useWebViewMessage'

const HomePage = () => {
  const { postMessage } = useWebViewMessage()

  const onClickBackNative = () => {
    postMessage('backHandler', { action: 'add' })
    postMessage('cleanScreenStack')

    postMessage('goScreen', {
      action: 'replace',
      modalName: 'SellTroubles',
    })
  }

  return (
    <>
      <Header
        title="니콘내콘 트러블"
        showLeftButton={false}
        showRightButton
        onRightButton={onClickBackNative}
      />

      <div className="flex justify-center items-center h-screen">
        <NdsButton onClick={onClickBackNative} text="홈으로 돌아가기" />
      </div>
    </>
  )
}

export default HomePage
