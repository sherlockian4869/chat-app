'use client'
import { useRecoilValue } from 'recoil'

import { userState } from '@/common/states/user'

import HomeScreen from './home/page'
import LoginScreen from './login/page'

export default function Home() {
  const user = useRecoilValue(userState)
  if (user) {
    return <HomeScreen />
  } else {
    return <LoginScreen />
  }
}
