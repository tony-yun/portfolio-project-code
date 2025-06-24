'use client'

import { type ReactNode } from 'react'
import { GlobalPortal } from '@/components/GlobalPortal'

const ClientPortalProvider = ({ children }: { children: ReactNode }) => {
  return <GlobalPortal.Provider>{children}</GlobalPortal.Provider>
}

export default ClientPortalProvider
