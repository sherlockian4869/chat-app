'use client'

import { RecoilRoot } from 'recoil'

import { ChakraProvider } from '@chakra-ui/react'

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider>
      <RecoilRoot>{children}</RecoilRoot>
    </ChakraProvider>
  )
}
