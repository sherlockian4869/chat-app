'use client'

import { useEffect, useState } from 'react'

import Loading from '@/common/components/loading.component'
import { Divider, List, ListItem } from '@/common/design'
import { Friend } from '@/common/models/friend.type'
import { getAllFriendsByUid } from '@/lib/apis/friend'
import { useRouter } from 'next/navigation'

export default function HomeScreen() {
  const router = useRouter()
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
    <List>
      {friends.map((friend, index) => (
        <>
          <ListItem
            key={index}
            paddingY='5px'
            onClick={() => router.push(`chat/${friend.chatId}`)}
          >
            {friend.username}
          </ListItem>
          <Divider />
        </>
      ))}
    </List>
  )
}
