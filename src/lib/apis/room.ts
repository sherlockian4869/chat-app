import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore'

import { Room } from '@/app/common/models/room.type'
import { User } from '@/app/common/models/user.type'
import { addFriend } from '@/lib/apis/friend'
import { registerGroup } from '@/lib/apis/group'
import { getUsersInfoByUidList } from '@/lib/apis/user'
import { auth, db, master } from '@/lib/config'

/**
 * チャットルームを登録 (個人)
 * @param friendUid
 */
export const registerRoomFromFriend = async (args: { friendUid: string }) => {
  const user = auth.currentUser
  const colRef = collection(db, master, 'rooms')
  // 配列型でfirestoreに登録
  const uidList = [user!.uid, args.friendUid]
  await addDoc(colRef, {
    listOfUid: uidList,
  }).then((docRef) => {
    updateDoc(docRef, {
      roomId: docRef.id,
    }).then(() => {
      addFriend({ roomId: docRef.id, friendUid: args.friendUid })
    })
  })
}

/**
 * チャットルームを登録 (グループ)
 * @param groupMember[]
 */
export const registerRoomFromGroup = async (args: {
  groupName: string
  groupMember: User[]
}) => {
  const colRef = collection(db, master, 'rooms')
  const members: string[] = args.groupMember.map((member) => member.uid)
  await addDoc(colRef, {
    listOfUid: members,
  }).then((docRef) => {
    updateDoc(docRef, {
      roomId: docRef.id,
    }).then(async () => {
      await registerGroup({
        roomId: docRef.id,
        groupName: args.groupName,
        groupMember: members,
      })
    })
  })
}

/**
 * ルーム情報の取得
 * @param roomId
 * @returns roomInfo
 */
export const getRoomInfoByRoomId = async (args: { roomId: string }) => {
  const docRef = doc(db, master, 'rooms', args.roomId)
  const result: Room = await getDoc(docRef).then(async (doc) => {
    const userList: User[] = await getUsersInfoByUidList({
      uidList: doc.data()!.listOfUid,
    })
    return {
      roomId: doc.data()!.roomId,
      listOfUser: userList,
    }
  })
  return result
}
