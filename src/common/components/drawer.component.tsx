'use client'
import NextLink from 'next/link'
import { useSetRecoilState } from 'recoil'

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  VStack,
  useToast,
} from '@/common/design'

import { logout } from '@/lib/apis/auth'
import { messageState } from '@/common/states/message'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function SideMenu({ isOpen, onClose }: Props) {
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
    <Drawer isOpen={isOpen} placement='right' onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader></DrawerHeader>

        <DrawerBody>
          <VStack display='flex' alignItems='left' paddingY='5px'>
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
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
