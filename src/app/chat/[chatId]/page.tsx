'use client'

import { format } from 'date-fns'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil'

import styles from '@/app/global.module.css'
import Loading from '@/common/components/loading.component'
import MessageComponent from '@/common/components/message.component'
import {
  Button,
  chakra,
  Container,
  Flex,
  Input,
  Spacer,
  Text,
  useToast,
} from '@/common/design'
import { Chat } from '@/common/models/chat.type'
import { Message } from '@/common/models/message.type'
import { userState } from '@/common/states/user'
import { getChatInfoByChatId } from '@/lib/apis/chat'
import { registerMessage } from '@/lib/apis/message'
import { db, master } from '@/lib/config'

type Props = {
  params: {
    chatId: string
  }
}

export default function TalkRoomScreen({ params }: Props) {
  const user = useRecoilValue(userState)
  const router = useRouter()
  const toast = useToast()
  const [message, setMessage] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])
  const [chat, setChat] = useState<Chat>()
  const [loading, setLoading] = useState<boolean>(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetch = async () => {
      await getChatInfoByChatId({
        chatId: params.chatId,
      }).then((res) => {
        setChat(res)
      })
      setLoading(false)
    }
    fetch()
  }, [])

  useEffect(() => {
    if (user) {
      const colRef = collection(db, master, 'chats', params.chatId, 'messages')
      const q = query(colRef, orderBy('sentAt', 'asc'))
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const chatInfo: Chat = await getChatInfoByChatId({
          chatId: params.chatId,
        })
        if (!snapshot.empty) {
          const _messages: Message[] = []
          for (const doc of snapshot.docs) {
            const timestamp = doc.data().sentAt?.seconds
            if (timestamp) {
              const date = new Date(timestamp * 1000)
              _messages.push({
                uid: doc.data().uid,
                username: chatInfo?.listOfUser.find(
                  (user) => user.uid === doc.data().uid
                )?.username!,
                message: doc.data().message,
                sentAt: format(date, 'MM/dd'),
              })
            }
          }
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
    registerMessage({
      message: message,
      chatId: params.chatId,
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
        <Button size='sm' onClick={() => router.back()}>
          戻る
        </Button>
        <Text fontSize='md'>
          {chat?.listOfUser.find((u) => u.uid !== user?.uid)!.username}
        </Text>
      </Flex>
      <Flex
        width='100%'
        flexDirection='column'
        gap={2}
        height='75vh'
        backgroundColor='green.50'
        borderRadius='md'
        paddingY='4'
        paddingX='2'
        overflowY='auto'
        className={styles.body}
        scrollBehavior='smooth'
        ref={scrollRef}
      >
        {messages.map((message, index) => (
          <MessageComponent
            key={index}
            params={{
              username: message.username,
              message: message.message,
              sentAt: message.sentAt,
            }}
          />
        ))}
      </Flex>
      <chakra.form
        width='100%'
        display='flex'
        gap='2'
        onSubmit={handleSendMessage}
        paddingY='2'
        backgroundColor='white'
      >
        <Input value={message} onChange={(e) => setMessage(e.target.value)} />
        <Button type='submit'>送信</Button>
      </chakra.form>
    </Container>
  )
}
