'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { GlobalPortal } from '../GlobalPortal'

type Position = 'top' | 'bottom'

interface ToastSnackbarProps {
  open: boolean
  children: ReactNode
  position?: Position
  duration?: number
  onClose?: () => void
}

const ToastSnackbarBase = ({
  open,
  children,
  position = 'bottom',
  duration = 3000,
  onClose,
}: ToastSnackbarProps) => {
  const [mounted, setMounted] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)

  useEffect(() => {
    if (!open) return

    setMounted(true)

    const enterTimer = setTimeout(() => {
      setVisible(true)
    }, 20)

    const exitTimer = setTimeout(() => {
      setVisible(false)

      setTimeout(() => {
        setMounted(false)

        onClose?.()
      }, 300)
    }, duration)

    return () => {
      clearTimeout(enterTimer)
      clearTimeout(exitTimer)
    }
  }, [open, duration, onClose])

  if (!mounted) return null

  const basePosition = position === 'top' ? 'top-16' : 'bottom-16'
  const transitionClass = `transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] pointer-events-auto`
  const motionClass = visible
    ? 'translate-y-0 opacity-100'
    : position === 'top'
    ? '-translate-y-6 opacity-0'
    : 'translate-y-6 opacity-0'

  return (
    <GlobalPortal.Consumer>
      <div
        className={`fixed left-1/2 ${basePosition} transform -translate-x-1/2 ${motionClass} ${transitionClass}`}
      >
        <div className="max-w-xs w-fit sm:max-w-sm text-pretty px-6 py-3 bg-gray-200 rounded-2xl shadow-2xs flex items-center gap-2">
          {children}
        </div>
      </div>
    </GlobalPortal.Consumer>
  )
}

export default ToastSnackbarBase
