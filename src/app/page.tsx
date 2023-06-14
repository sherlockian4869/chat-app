'use client'
import { useRouter } from 'next/navigation'
import { useRecoilValue } from 'recoil'

import { userState } from '@/app/common/states/user'

export default function Home() {
  const user = useRecoilValue(userState)
  const router = useRouter()
  if (user) {
    router.push('/home')
  } else {
    router.push('/login')
  }
}
