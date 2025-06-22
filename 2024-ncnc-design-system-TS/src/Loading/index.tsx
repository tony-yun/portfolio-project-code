import React from 'react'
import type { LoadingProps } from '../../lib/types/loading/general.types'
import LoadingDots from './LoadingDots'
import NcLoading from './NcLoading'
import ProgressView from './ProgressView'
import Spinner from './Spinner'

const Loading = (props: LoadingProps) => {
  const { variant } = props

  switch (variant) {
    case 'spinner':
      return <Spinner />
    case 'nc-loading':
      return <NcLoading />
    case 'loading-dots':
      return <LoadingDots />
    case 'progress-view':
      return <ProgressView />
  }
}

export { Loading, type LoadingProps }
