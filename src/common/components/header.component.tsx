'use client'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'

import { logout } from '@/lib/apis/auth'
import { Box, Button, Flex, Heading, HStack, useToast } from '@chakra-ui/react'
import { useSetRecoilState } from 'recoil'
import { messageState } from '../states/message'

export default function Header() {
  const router = useRouter()
  const setMessage = useSetRecoilState(messageState)
  const toast = useToast()

  const clickLogout = async () => {
    await logout().then(() => {
      setMessage(false)
      toast({
        title: 'ログアウトしました',
        status: 'success',
        isClosable: true,
      })
    })
  }
  return (
    <Box as='header' position={'sticky'} top={0} zIndex={'docked'}>
      <Flex
        bg='white'
        color='gray.600'
        minH='60px'
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle='solid'
        borderColor='gray.200'
        align='center'
      >
        <Flex flex={1} justify='space-between' maxW='5xl' mx='auto'>
          <Heading as='h1' size='lg'>
            <NextLink href='/home'>chat-app</NextLink>
          </Heading>

          <HStack spacing='4'>
            <Button onClick={() => clickLogout()} colorScheme='red'>
              ログアウト
            </Button>
          </HStack>
        </Flex>
      </Flex>
    </Box>
  )
}
