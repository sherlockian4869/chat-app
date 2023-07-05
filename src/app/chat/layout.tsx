import Main from '@/common/components/main.component'
import { AuthGuard } from '@/common/providers/auth_guard'

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <Main>{children}</Main>
    </AuthGuard>
  )
}
