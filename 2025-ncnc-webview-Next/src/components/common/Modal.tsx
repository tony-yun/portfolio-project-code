'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { GlobalPortal } from '../GlobalPortal'

interface ModalProps {
  open: boolean
  close: () => void
  children: ReactNode
  hideOverlayClick?: boolean
}

const Modal = ({ open, close, children }: ModalProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!overlayRef.current || !contentRef.current) return

    const overlay = overlayRef.current
    const content = contentRef.current

    if (open) {
      setIsVisible(true)

      requestAnimationFrame(() => {
        overlay?.classList.add('opacity-100')
        content?.classList.add('scale-100', 'opacity-100')
      })
    } else {
      overlay?.classList.remove('opacity-100')
      content?.classList.remove('scale-100', 'opacity-100')

      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 200)

      return () => clearTimeout(timer)
    }
  }, [open])

  if (!isVisible && !open) {
    return null
  }

  return (
    <GlobalPortal.Consumer>
      <div className="fixed inset-0 flex items-center justify-center">
        <div
          ref={overlayRef}
          className="fixed inset-0 bg-black-opacity-300 transition-opacity duration-300 opacity-0"
          onClick={close}
        />

        <div
          ref={contentRef}
          className={
            'relative w-full max-w-md mx-4 rounded-2xl bg-white p-6 shadow-lg transform scale-95 opacity-0 transition-all duration-200'
          }
        >
          {children}
        </div>
      </div>
    </GlobalPortal.Consumer>
  )
}

export default Modal
