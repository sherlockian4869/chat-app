'use client'

import { format } from 'date-fns'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil'

import Loading from '@/app/common/components/loading.component'
import Message from '@/app/common/components/message.component'
import {
  Button,
  chakra,
  Container,
  Flex,
  Input,
  Text,
  useToast,
} from '@/app/common/design'
import { Chat } from '@/app/common/models/chat.type'
import { userState } from '@/app/common/states/user'
import styles from '@/app/global.module.css'
import { registerChat } from '@/lib/apis/chat'
import { getFriendNameByRoomId } from '@/lib/apis/friend'
import { db, master } from '@/lib/config'

type Props = {
  params: {
    roomId: string
  }
}

export default function TalkRoomScreen({ params }: Props) {
  const user = useRecoilValue(userState)
  const router = useRouter()
  const toast = useToast()
  const [message, setMessage] = useState<string>('')
  const [messages, setMessages] = useState<Chat[]>([])
  const [friendName, setFriendName] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetch = async () => {
      await getFriendNameByRoomId({ roomId: params.roomId }).then((res) => {
        setFriendName(res)
      })
      setLoading(false)
    }
    fetch()
  }, [])
  useEffect(() => {
    if (user) {
      const colRef = collection(db, master, 'rooms', params.roomId, 'chats')
      const q = query(colRef, orderBy('sentAt', 'asc'))
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const _messages: Chat[] = []
          snapshot.forEach((doc) => {
            const timestamp = doc.data().sentAt?.seconds
            if (timestamp) {
              const date = new Date(parseInt(timestamp, 10) * 1000)
              _messages.push({
                uid: doc.data().uid,
                username: '',
                message: doc.data().message,
                sentAt: format(date, 'MM/dd'),
              })
            }
          })
          setMessages(_messages)
        }
        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
          }
        }, 500)
      })
      return () => {
        unsubscribe()
      }
    }
  }, [])
  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (message === '') {
      toast({
        title: 'メッセージを入力してください',
        status: 'error',
        isClosable: true,
      })
      return
    }
    registerChat({
      message: message,
      roomId: params.roomId,
      uid: user!.uid,
    }).then(() => {
      setMessage('')
    })
  }
  return loading ? (
    <Loading />
  ) : (
    <Container
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      width='100%'
    >
      <Flex
        width='100%'
        justifyContent='space-between'
        alignItems='center'
        paddingY='4'
      >
        <Text fontSize='lg' width='100%'>
          {friendName}
        </Text>
        <Button onClick={() => router.back()}>戻る</Button>
      </Flex>
      <Flex
        width='100%'
        flexDirection='column'
        gap={2}
        height='60vh'
        backgroundColor='green.50'
        borderRadius='lg'
        paddingY='4'
        paddingX='2'
        overflowY='auto'
        className={styles.body}
        scrollBehavior='smooth'
        ref={scrollRef}
      >
        {messages.map((message, index) => (
          <Message
            key={`ChatMessage_${index}`}
            params={{
              username: message.uid === user?.uid ? '自分' : friendName,
              message: message.message,
              sentAt: message.sentAt,
            }}
          />
        ))}
      </Flex>
      <chakra.form
        width='100%'
        display={'flex'}
        gap={2}
        onSubmit={handleSendMessage}
        paddingY='2'
        backgroundColor='white'
      >
        <Input value={message} onChange={(e) => setMessage(e.target.value)} />
        <Button type={'submit'}>送信</Button>
      </chakra.form>
    </Container>
  )
}
