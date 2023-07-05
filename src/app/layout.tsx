import { AuthContextProvider } from '@/common/providers/auth_provider'

import styles from '@/app/global.module.css'
import Provider from '@/common/providers/chakra_provider'

export const metadata = {
  title: 'chat-app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='ja'>
      <body className={styles.body}>
        <Provider>
          <AuthContextProvider>{children}</AuthContextProvider>
        </Provider>
      </body>
    </html>
  )
}
