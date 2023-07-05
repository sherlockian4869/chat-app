import Footer from '@/common/components/footer.component'
import Header from '@/common/components/header.component'
import Main from '@/common/components/main.component'
import { AuthGuard } from '@/common/providers/AuthGuard'

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
