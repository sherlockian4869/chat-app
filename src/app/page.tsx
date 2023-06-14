'use client'
import { useRouter } from 'next/navigation'
import { FcGoogle } from 'react-icons/fc'

import { Button, Flex, Icon, Text, VStack } from '@/app/common/design'
import { loginWithGoogle } from '@/lib/apis/auth'

export default function LoginScreen() {
  const router = useRouter()
  const onClickGoogle = async () => {
    await loginWithGoogle().then(() => {
      router.push('/home')
    })
  }
  return (
    <Flex height='100vh' justifyContent='center' paddingTop='20vh'>
      <VStack spacing='5'>
        <Text fontSize='5xl' fontWeight='bold' textAlign='center'>
          chat-app
        </Text>
        <Button
          variant='outline'
          marginTop='4'
          colorScheme='gray'
          type='submit'
          paddingX='10'
          leftIcon={<Icon as={FcGoogle} />}
          onClick={() => onClickGoogle()}
        >
          Googleでログインする
        </Button>
      </VStack>
    </Flex>
  )
}
