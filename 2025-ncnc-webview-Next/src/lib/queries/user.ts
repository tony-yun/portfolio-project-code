import { api } from '@/lib/core/axios'
import type { Me } from '../types/user.types'

export const userKey = {
  me: (token: string | undefined) => ['me', token] as const,
}

export const fetchMe = async () => {
  const {
    data: { me },
  } = await api.get<{ me: Me }>('/users/me')

  return me
}
