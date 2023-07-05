import Footer from '@/common/components/footer.component'
import Header from '@/common/components/header.component'
import Main from '@/common/components/main.component'
import { AuthGuard } from '@/common/providers/auth_guard'

export default function HomeLayout({
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
