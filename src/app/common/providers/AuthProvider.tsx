'use client'

import { onAuthStateChanged } from 'firebase/auth'
import React from 'react'
import { useRecoilState } from 'recoil'

import Loading from '@/app/common/components/loading.component'
import { userState } from '@/app/common/states/user'
import { auth } from '@/lib/config'

export const AuthContext = React.createContext({})

export const useAuthContext = () => React.useContext(AuthContext)

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [user, setUser] = useRecoilState(userState)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          username: user.displayName!,
          email: user.email!,
          photoURL: user.photoURL!,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user }}>
      {loading ? <Loading /> : children}
    </AuthContext.Provider>
  )
}
