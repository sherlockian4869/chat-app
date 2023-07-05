'use client'
import { Avatar, Flex, Stack, Text } from '@/common/design'

type MessageProps = {
  params: {
    username: string
    message: string
    sentAt: string
  }
}

export default function MessageComponent({ params }: MessageProps) {
  return (
    <Flex alignItems='center' width='90%' marginY='2'>
      <Avatar size='sm' />
      <Stack marginLeft='2' direction='row'>
        <Stack>
          <Text fontSize='xs'>{params.username}</Text>
          <Flex alignItems='end'>
            <Text
              bgColor='gray.100'
              rounded='lg'
              paddingX='2'
              paddingY='1'
              fontSize='sm'
              wordBreak='break-all'
            >
              {params.message}
            </Text>
            <Text marginLeft='2' fontSize='3xs'>
              {params.sentAt}
            </Text>
          </Flex>
        </Stack>
      </Stack>
    </Flex>
  )
}
