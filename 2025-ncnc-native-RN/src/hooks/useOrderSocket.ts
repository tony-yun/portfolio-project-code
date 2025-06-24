import { SOCKET_URL } from '@env'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AppState, AppStateStatus } from 'react-native'
import { useRecoilState, useRecoilValue } from 'recoil'
import socketIOClient, { Socket } from 'socket.io-client'
import { recordLog } from '../public/error-helper'
import { Nullable, SocketResult } from '../public/types/global.types'
import { orderBookStatusState, orderIdState } from '../stores/orders'
import useMe from './useMe'

type UseOrderSocketHook = () => {
  connected: boolean
  connect: () => void
  disconnect: () => void
}

export const SOCKET_ORDER_RESULT_KEY = ['socket-order-result']

const useOrderSocket: UseOrderSocketHook = () => {
  const queryClient = useQueryClient()

  const { me } = useMe()

  const orderId = useRecoilValue(orderIdState)
  const [orderBookStatus, setOrderBookStatus] =
    useRecoilState<SocketResult>(orderBookStatusState)

  const [connected, setConnected] = useState<boolean>(false)
  const [orderFailMessage, setOrderFailMessage] =
    useState<Nullable<string>>(null)

  const socketRef = useRef<Nullable<Socket>>(null)
  const appStateRef = useRef<AppStateStatus>(AppState.currentState)

  const init = useCallback(() => {
    if (socketRef.current || !me?.id) return

    const socketClient = socketIOClient(`${SOCKET_URL}/order/book`, {
      transports: ['websocket'],
      query: {
        userId: String(me?.id),
        orderId: String(orderId),
      },
      autoConnect: false,
    })

    socketRef.current = socketClient
    setOrderFailMessage(null)

    recordLog('init success on OrderSocket', {
      id: socketClient.id,
    })
  }, [me, orderId])

  useEffect(() => {
    if (connected) return

    if (me?.id && orderId) {
      init()
    }
  }, [connected, me, orderId, init])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      recordLog('app state change listening on OrderSocket', {
        previousAppState: appStateRef.current,
        currentAppState: nextAppState,
      })

      appStateRef.current = nextAppState
    })

    return () => {
      subscription.remove()
    }
  }, [])

  const handleConnect = () => {
    recordLog('connected on OrderSocket', {
      id: socketRef.current?.id,
    })

    setConnected(true)
  }

  const handleConnectError = (err: unknown) => {
    const errorMessage =
      err instanceof Error ? err.message : 'Error on network connection.'

    recordLog('connect error on OrderSocket', {
      id: socketRef.current?.id,
      message: errorMessage,
      ...(err instanceof Error ? err : {}),
    })
  }

  const handleOrderSuccess = () => {
    recordLog('order success on OrderSocket', {
      id: socketRef.current?.id,
    })
    setOrderBookStatus('success')
  }

  const handleOrderFail = (reason: string) => {
    recordLog('order fail on OrderSocket', {
      id: socketRef.current?.id,
      reason,
    })
    setOrderBookStatus('fail')
    setOrderFailMessage(reason)
  }

  const handleDisconnect = (reason: Socket.DisconnectReason) => {
    recordLog('disconnected on OrderSocket', {
      id: socketRef.current?.id,
      reason,
    })

    setConnected(false)
  }

  const addListeners = () => {
    if (!socketRef.current) return

    socketRef.current.on('connect', handleConnect)
    socketRef.current.on('connect_error', handleConnectError)
    socketRef.current.on('success', handleOrderSuccess)
    socketRef.current.on('fail', handleOrderFail)
    socketRef.current.on('disconnect', handleDisconnect)
  }

  const connect = () => {
    if (!socketRef.current) return

    recordLog('connect OrderSocket')

    addListeners()
    socketRef.current.connect()
  }

  const disconnect = () => {
    if (!socketRef.current) return

    recordLog('disconnect OrderSocket')

    socketRef.current.offAny()
    socketRef.current.disconnect()
    socketRef.current = null
    setConnected(false)
  }

  useEffect(() => {
    queryClient.setQueryData(SOCKET_ORDER_RESULT_KEY, {
      result: orderBookStatus,
      failMessage: orderFailMessage,
    })
  }, [orderBookStatus, orderFailMessage])

  return {
    connected,
    connect,
    disconnect,
  }
}

export default useOrderSocket
