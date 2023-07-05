'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import {
  Button,
  Flex,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from '@/common/design'
import { User } from '@/common/models/user.type'
import { isContainsFriend } from '@/lib/apis/friend'
import { registerChatFromFriend } from '@/lib/apis/chat'
import { searchUser } from '@/lib/apis/user'

export default function FriendAddScreen() {
  const router = useRouter()
  const toast = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState<string>('')
  const onClickSearch = async () => {
    await searchUser({ search: search }).then((res) => {
      setUsers(res)
    })
  }
  const onClickAdd = async (friendUid: string) => {
    await isContainsFriend({ friendUid: friendUid }).then(async (res) => {
      if (res) {
        toast({
          title: '既に友達です',
          status: 'error',
          isClosable: true,
        })
        return
      } else {
        await registerChatFromFriend({ friendUid: friendUid }).then((res) => {
          toast({
            title: '友達追加しました',
            status: 'success',
            isClosable: true,
          })
        })
      }
    })
  }
  return (
    <>
      <Button
        backgroundColor='orange.400'
        _hover={{ backgroundColor: 'orange.300' }}
        color='white'
        onClick={() => router.back()}
      >
        戻る
      </Button>
      <Flex margin='10px'>
        <Input marginX='10px' onChange={(e) => setSearch(e.target.value)} />
        <Button onClick={() => onClickSearch()}>検索</Button>
      </Flex>
      <TableContainer>
        <Table size='sm'>
          <Thead>
            <Tr>
              <Th>ユーザ名</Th>
              <Th width='20'>追加</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.uid}>
                <Td>{user.username}</Td>
                <Td>
                  <Button onClick={() => onClickAdd(user.uid)}>追加</Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  )
}
