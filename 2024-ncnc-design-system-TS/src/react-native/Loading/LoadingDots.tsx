import { color } from '@doublenc-inc/nds-core'
import React, { useEffect, useRef } from 'react'
import { Animated, Easing, StyleSheet, View } from 'react-native'
import type { LoadingDotsProps } from '../../lib/types/loading/general.types'

const OPACITY_STEPS = [1, 0.5, 0.2]

const LoadingDots = ({ basicButtonDotColor }: LoadingDotsProps) => {
  const opacities = [
    useRef(new Animated.Value(OPACITY_STEPS[0])).current,
    useRef(new Animated.Value(OPACITY_STEPS[1])).current,
    useRef(new Animated.Value(OPACITY_STEPS[2])).current,
  ]

  const createTiming = (val: Animated.Value, to: number) =>
    Animated.timing(val, {
      toValue: to,
      duration: 280,
      easing: Easing.linear,
      useNativeDriver: true,
    })

  useEffect(() => {
    const [a, b, c] = opacities

    const steps = [
      [createTiming(a, 0.5), createTiming(b, 1)],
      [createTiming(a, 0.2), createTiming(b, 0.5), createTiming(c, 1)],
      [createTiming(a, 1), createTiming(b, 0.5), createTiming(c, 0.2)],
    ]

    const animation = Animated.loop(
      Animated.sequence(steps.map((step) => Animated.parallel(step))),
    )

    animation.start()

    return () => {
      animation.stop()
    }
  }, [opacities])

  const dotColor = basicButtonDotColor ?? color.gray.white

  return (
    <View style={styles.wrapper}>
      {opacities.map((opacity, index) => (
        <Animated.View
          key={index}
          style={[
            styles.node,
            {
              opacity,
              backgroundColor: dotColor,
            },
          ]}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    gap: 4,
  },
  node: {
    width: 8,
    height: 8,
    borderRadius: 8,
  },
})

export default LoadingDots
