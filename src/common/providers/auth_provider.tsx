'use client'

import { onAuthStateChanged } from 'firebase/auth'
import React from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'

import Loading from '@/common/components/loading.component'
import { userState } from '@/common/states/user'
import { auth } from '@/lib/config'
import { messageState } from '@/common/states/message'

export const AuthContext = React.createContext({})

export const useAuthContext = () => React.useContext(AuthContext)

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [user, setUser] = useRecoilState(userState)
  const [loading, setLoading] = React.useState(true)
  const setMessage = useSetRecoilState(messageState)

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setMessage(true)
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
