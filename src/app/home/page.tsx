'use client'

import NextLink from 'next/link'
import { useEffect, useState } from 'react'

import Loading from '@/app/common/components/loading.component'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  VStack,
} from '@/app/common/design'
import { Friend } from '@/app/common/models/friend.type'
import { getAllFriendsByUid } from '@/lib/apis/friend'

export default function HomeScreen() {
  const [friends, setFriends] = useState<Friend[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetch = async () => {
      await getAllFriendsByUid().then((res) => {
        setFriends(res)
      })
      setLoading(false)
    }
    fetch()
  }, [])
  return loading ? (
    <Loading />
  ) : (
    <VStack>
      <Flex width='100%' justifyContent='right' paddingY='4' gap='4'>
        <Button
          as={NextLink}
          backgroundColor='green.400'
          _hover={{ backgroundColor: 'green.500' }}
          color='white'
          href='/home/add'
        >
          友達追加
        </Button>
        <Button
          as={NextLink}
          backgroundColor='green.400'
          _hover={{ backgroundColor: 'green.500' }}
          color='white'
          href='/group/add'
        >
          グループ追加
        </Button>
      </Flex>
      <Accordion allowMultiple width='100%'>
        <AccordionItem>
          <AccordionButton _hover={{ bg: 'green.100' }}>
            <Box as='span' flex='1' textAlign='left'>
              友達一覧
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <Flex width='100%' flexDirection='column' gap='1'>
              {friends.map((friend, index) => (
                <Box
                  as={NextLink}
                  width='100%'
                  padding={3}
                  key={index}
                  cursor='pointer'
                  borderRadius='lg'
                  href={`/room/${friend.roomId}`}
                  backgroundColor='orange.50'
                  _hover={{ backgroundColor: 'orange.100' }}
                >
                  {friend.username}
                </Box>
              ))}
            </Flex>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionButton _hover={{ bg: 'green.100' }}>
            <Box as='span' flex='1' textAlign='left'>
              グループ一覧
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel></AccordionPanel>
        </AccordionItem>
      </Accordion>
    </VStack>
  )
}
