'use client'
import { Avatar, Flex, Stack, Text } from '@/app/common/design'

type MessageProps = {
  params: {
    username: string
    message: string
    sentAt: string
  }
}

export default function Message({ params }: MessageProps) {
  return (
    <Flex alignItems={'start'}>
      <Avatar size='sm' />
      <Stack marginLeft='2'>
        <Text fontSize='xs'>{params.username}</Text>
        <Flex>
          <Text
            bgColor='gray.100'
            rounded='lg'
            paddingX='2'
            paddingY='2'
            fontSize='sm'
          >
            {params.message}
          </Text>
        </Flex>
        <Text align='right' fontSize='2xs'>
          {params.sentAt}
        </Text>
      </Stack>
    </Flex>
  )
}
