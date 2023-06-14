'use client'

import { format } from 'date-fns'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { FormEvent, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'

import Loading from '@/app/common/components/loading.component'
import Message from '@/app/common/components/message.component'
import {
  Button,
  chakra,
  Container,
  Flex,
  Heading,
  Input,
  Spacer,
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
  const toast = useToast()
  const [message, setMessage] = useState<string>('')
  const [messages, setMessages] = useState<Chat[]>([])
  const [friendName, setFriendName] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    const fetch = async () => {
      getFriendNameByRoomId({ roomId: params.roomId }).then((res) => {
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
    <Container paddingY='4'>
      <Heading>{friendName}</Heading>
      <Flex
        flexDirection={'column'}
        overflowY={'auto'}
        gap={2}
        height='60vh'
        className={styles.body}
        marginY='4'
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
      <Spacer height={2} aria-hidden />
      <chakra.form display={'flex'} gap={2} onSubmit={handleSendMessage}>
        <Input value={message} onChange={(e) => setMessage(e.target.value)} />
        <Button type={'submit'}>送信</Button>
      </chakra.form>
    </Container>
  )
}
