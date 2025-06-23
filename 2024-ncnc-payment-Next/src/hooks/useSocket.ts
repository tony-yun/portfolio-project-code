import type { Nullable } from '@lib/types/global.types'
import type { User } from '@lib/types/me.types'
import type { OrderResult } from '@lib/types/order.types'
import { userInfoState } from '@stores/me'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { io, Socket } from 'socket.io-client'

type SocketUri = 'book' | 'delivery'

/**
 * @description sqs에서 결제 요청이 success인지 fail인지 알려주기 위한 소켓 훅
 * @param orderId
 * @param socketType
 * @returns 결제 요청 결과 및 실패 메시지 반환
 */
const useSocket = (orderId: string, socketType: SocketUri) => {
  const { userId } = useRecoilValue<User>(userInfoState)

  const [socket, setSocket] = useState<Nullable<Socket>>(null)
  const [socketOrderResult, setSocketOrderResult] = useState<OrderResult>(null)
  const [socketFailMessage, setSocketFailMessage] =
    useState<Nullable<string>>(null)

  useEffect(() => {
    if (socket || !orderId || userId === 0) {
      return
    }

    const tempSocket = io(
      `${process.env.NEXT_PUBLIC_SOCKET_URL}/order/${socketType}`,
      {
        transports: ['websocket'],
        query: {
          userId,
          orderId,
        },
      },
    )

    setSocket(tempSocket)
  }, [userId, orderId, socketType, socket])

  useEffect(() => {
    if (!socket) {
      return
    }

    socket.on('connect_error', () => {
      socket.disconnect()
    })

    socket.on('success', () => {
      setSocketOrderResult('success')

      socket.disconnect()
    })

    socket.on('fail', (data: string) => {
      setSocketOrderResult('fail')
      setSocketFailMessage(data)
      socket.disconnect()
    })

    return () => {
      socket.disconnect()
      setSocket(null)
    }
  }, [socket])

  return { socketOrderResult, socketFailMessage }
}

export default useSocket
