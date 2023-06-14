import Footer from '@/app/common/components/footer.component'
import Header from '@/app/common/components/header.component'
import Main from '@/app/common/components/main.component'
import { AuthGuard } from '@/app/common/providers/AuthGuard'

export default function GroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </AuthGuard>
  )
}
