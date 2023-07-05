'use client'
import { Flex, Spinner } from '@/common/design'

export default function Loading() {
  return (
    <Flex h='100vh' justifyContent='center' alignItems='center'>
      <Spinner
        thickness='4px'
        speed='0.65s'
        emptyColor='gray.200'
        color='green.500'
        minW='50'
        minH='50'
      />
    </Flex>
  )
}
