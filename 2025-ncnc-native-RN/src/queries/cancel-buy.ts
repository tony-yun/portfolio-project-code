import apiClient from '../apiClient'
import { CancelBuyConsPayload } from '../public/types/cancel-buy.types'
import { MessageResponse } from '../public/types/global.types'

// query key
export const cancelBuyKey = {
  isCanceledBuy: (orderId: number, conIds: number[]) =>
    ['fetch-is-canceled-buy', orderId, conIds] as const,
  socketResult: () => ['cancel-buy-socket-result'] as const,
}

export const cancelBuyCons = async (
  payload: CancelBuyConsPayload,
): Promise<MessageResponse> => {
  const { data } = await apiClient.paymentApi.post('/...', payload)

  return data
}

export const checkIsCanceledBuy = async (
  payload: CancelBuyConsPayload,
): Promise<MessageResponse> => {
  const { orderId, conIds } = payload

  const { data } = await apiClient.paymentApi.get(
    `/...`,
    {
      params: { conIds },
    },
  )

  return data
}
