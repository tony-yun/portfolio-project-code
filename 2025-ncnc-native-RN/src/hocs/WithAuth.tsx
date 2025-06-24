import { color } from '@doublenc-inc/nds-core'
import styled from '@emotion/native'
import React, { useEffect } from 'react'
import LoginBottomSheet from '../components/login/LoginBottomSheet'
import useMe from '../hooks/useMe'

type WithAuthHoc = (
  WrappedComponent: React.ElementType,
) => (props) => JSX.Element

const LoginWrapper = styled.View`
  padding-top: 25%;
  background-color: ${color.gray.white};
`

const withAuth: WithAuthHoc = (WrappedComponent) => (props) => {
  const { navigation } = props

  const { me } = useMe()

  useEffect(() => {
    navigation.setOptions({
      headerTintColor: me ? color.gray.black : color.gray.white,
    })
  }, [me])

  if (me?.id) {
    return <WrappedComponent {...props} />
  }

  return (
    <LoginWrapper>
      <LoginBottomSheet mode="buy" />
    </LoginWrapper>
  )
}

export default withAuth
