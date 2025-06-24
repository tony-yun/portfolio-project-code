import {
  iconography,
  type NdsIconColor,
  type NdsIconGroup,
  type NdsIconName,
} from '@doublenc-inc/nds-core'
import Image from 'next/image'

interface NdsIconProps<G extends NdsIconGroup, N extends NdsIconName<G>> {
  group: G
  name: N
  color: NdsIconColor<G, N>
  size: number
}

/**
 * group, name, color 속성을 차례대로 입력하여 아이콘을 표시합니다.
 */
const NdsIcon = <G extends NdsIconGroup, N extends NdsIconName<G>>({
  group,
  name,
  color,
  size,
}: NdsIconProps<G, N>) => {
  const uri = iconography.get(`${group}/${name}/${color}`)

  return (
    <Image src={uri ?? ''} alt={`${name} icon`} height={size} width={size} />
  )
}

export default NdsIcon
