'use client'
import { useRecoilValue } from 'recoil'

import { userState } from '@/app/common/states/user'

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
