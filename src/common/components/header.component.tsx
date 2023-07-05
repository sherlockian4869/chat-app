'use client'
import NextLink from 'next/link'

import { logout } from '@/lib/apis/auth'
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  useToast,
  HamburgerIcon,
  useDisclosure,
} from '@/common/design'
import { useSetRecoilState } from 'recoil'
import { messageState } from '@/common/states/message'
import styles from '@/app/global.module.css'
import SideMenu from '@/common/components/drawer.component'

export default function Header() {
  const setMessage = useSetRecoilState(messageState)
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

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

          <div className={styles.header_button}>
            <HamburgerIcon
              as='button'
              onClick={() => onOpen()}
              cursor='pointer'
            />
          </div>
          <div className={styles.header_button_group}>
            <HStack spacing='4'>
              <Button
                as={NextLink}
                backgroundColor='green.400'
                _hover={{ backgroundColor: 'green.500' }}
                color='white'
                href='/home/add'
              >
                友達追加
              </Button>
              <Button onClick={() => clickLogout()} colorScheme='red'>
                ログアウト
              </Button>
            </HStack>
          </div>
          <SideMenu isOpen={isOpen} onClose={onClose} />
        </Flex>
      </Flex>
    </Box>
  )
}
