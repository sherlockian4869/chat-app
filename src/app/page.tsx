'use client'
import { useRecoilValue } from 'recoil'

import { userState } from '@/common/states/user'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const user = useRecoilValue(userState)
  if (user) {
    router.replace('/home')
  } else {
    router.replace('/login')
  }
}
