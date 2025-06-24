/**
 * 4자리씩 구분하여 반환
 * @example formatInGroupsOfFour(1234567890) // '123 4567 890'
 * @returns string
 */
export const formatInGroupsOfFour = (num: number): string => {
  return (
    num
      .toString()
      .match(/.{1,4}/g)
      ?.join(' ') ?? ''
  )
}
