import { AuthContextProvider } from '@/app/common/providers/AuthProvider'
import Provider from '@/app/common/providers/Provider'
import styles from '@/app/global.module.css'

export const metadata = {
  title: 'chat-app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className={styles.body}>
        <Provider>
          <AuthContextProvider>{children}</AuthContextProvider>
        </Provider>
      </body>
    </html>
  )
}
