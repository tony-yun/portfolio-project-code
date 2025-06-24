import { Header } from '@/components'

const ExtraTroubleLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header title="" hideBottomBorder />

      {children}
    </>
  )
}

export default ExtraTroubleLayout
