import { useCallback, useContext } from 'react'
import NdsContext from '../context'
import type { NdsContextValue } from '../lib/types/context.types'
import type { ToastOption } from '../lib/types/dialog/toast.types'

const useToast = () => {
  const { toastOption, setToastOption } =
    useContext<NdsContextValue>(NdsContext)

  const show = useCallback(
    (option: ToastOption) => {
      if (toastOption) return

      setToastOption(option)
    },
    [toastOption],
  )

  return { show }
}

export { useToast, type ToastOption }
