import { Header } from '@/components'

const ExplanationLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header title="" hideBottomBorder />

      {children}
    </>
  )
}

export default ExplanationLayout
