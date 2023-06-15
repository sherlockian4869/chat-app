'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useRecoilValue } from 'recoil'

import {
  Button,
  Center,
  Flex,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from '@/app/common/design'
import { User } from '@/app/common/models/user.type'
import { userState } from '@/app/common/states/user'
import { registerRoomFromGroup } from '@/lib/apis/room'
import { getUserInfoByUid, searchUser } from '@/lib/apis/user'

export default function GroupAddScreen() {
  const user = useRecoilValue(userState)
  const router = useRouter()
  const toast = useToast()
  const [members, setMembers] = useState<User[]>([user!])
  const [groupName, setGroupName] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState<string>('')
  const onClickSearch = async () => {
    await searchUser({ search: search }).then((res) => {
      setUsers(res)
    })
  }
  const onClickSave = async () => {
    if (groupName === '') {
      toast({
        title: 'グループ名を入力してください',
        status: 'error',
        isClosable: true,
      })
      return
    } else if (members.length === 1) {
      toast({
        title: 'メンバーを追加してください',
        status: 'error',
        isClosable: true,
      })
      return
    } else if (members.length > 10) {
      toast({
        title: 'メンバーは10人までです',
        status: 'error',
        isClosable: true,
      })
      return
    }
    await registerRoomFromGroup({
      groupName: groupName,
      groupMember: members,
    }).then(() => {
      toast({
        title: 'グループ追加しました',
        status: 'success',
        isClosable: true,
      })
      router.back()
    })
  }
  const onClickAdd = async (friendUid: string) => {
    if (members.find((member) => member.uid === friendUid)) {
      toast({
        title: '既にメンバーに追加しています',
        status: 'error',
        isClosable: true,
      })
      return
    } else {
      await getUserInfoByUid({ uid: friendUid }).then((res) => {
        setMembers([...members, res])
      })
    }
  }
  const onClickDel = (uid: string) => {
    setMembers(members.filter((member) => member.uid !== uid))
  }
  return (
    <Flex flexDirection='column' width='100%'>
      <Flex
        justifyContent='space-between'
        alignItems='center'
        width='100%'
        paddingY='4'
      >
        <Button onClick={() => router.back()}>戻る</Button>
        <Button onClick={() => onClickSave()}>保存</Button>
      </Flex>
      <Text fontSize='xl'>グループ名</Text>
      <Flex margin='10px'>
        <Input
          marginX='10px'
          placeholder='グループ名'
          onChange={(e) => setGroupName(e.target.value)}
        />
      </Flex>
      <Text fontSize='xl'>グループメンバー</Text>
      <TableContainer margin='4'>
        <Table size='sm'>
          <Thead backgroundColor='gray.50'>
            <Tr>
              <Th>ユーザ名</Th>
              <Th width='20'>削除</Th>
            </Tr>
          </Thead>
          <Tbody>
            {members.map((member) => (
              <Tr key={member.uid}>
                <Td>{member.username}</Td>
                <Td>
                  {user!.uid === member.uid ? null : (
                    <Button onClick={() => onClickDel(member.uid)}>削除</Button>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Flex margin='10px' paddingTop='10'>
        <Input marginX='10px' onChange={(e) => setSearch(e.target.value)} />
        <Button onClick={() => onClickSearch()}>検索</Button>
      </Flex>
      <TableContainer>
        <Table size='sm'>
          <Thead backgroundColor='gray.50'>
            <Tr>
              <Th>ユーザ名</Th>
              <Th width='20'>招待</Th>
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
      {users.length === 0 ? <Center>検索結果がありません</Center> : null}
    </Flex>
  )
}
