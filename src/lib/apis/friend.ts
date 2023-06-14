import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore'

import { getRoomInfoByRoomId } from '@/lib/apis/room'
import { getUserInfoByUid } from '@/lib/apis/user'
import { auth, db, master } from '@/lib/config'

/**
 * 既に友達かを判定
 * @param friendUid
 * @returns boolean
 */
export const isContainsFriend = async (args: { friendUid: string }) => {
  const user = auth.currentUser
  let result = false
  const colRef = collection(db, master, 'users', user!.uid, 'friends')
  const q = query(colRef, where('uid', '==', args.friendUid))
  const querySnapshot = await getDocs(q)
  if (querySnapshot.docs.length > 0) {
    result = true
  }
  return result
}

/**
 * 友達を追加
 * @param roomId
 * @param friendUid
 */
export const addFriend = async (args: {
  roomId: string
  friendUid: string
}) => {
  const user = auth.currentUser
  const docRef = doc(db, master, 'users', user!.uid, 'friends', args.roomId)
  await setDoc(docRef, {
    roomId: args.roomId,
    uid: args.friendUid,
  }).then(() => {
    const docRef = doc(
      db,
      master,
      'users',
      args.friendUid,
      'friends',
      args.roomId
    )
    setDoc(docRef, {
      roomId: args.roomId,
      uid: user!.uid,
    }).then(() => {
      return true
    })
  })
}

/**
 * 自分の友達一覧を取得
 * @returns { roomId: string; uid: string }[]
 */
export const getAllFriendsByUid = async () => {
  const user = auth.currentUser
  const colRef = collection(db, master, 'users', user!.uid, 'friends')
  const querySnapshot = await getDocs(colRef)
  const friends = []

  for (const doc of querySnapshot.docs) {
    const userData = await getUserInfoByUid({ uid: doc.data().uid })
    const user = userData ? userData.username : null

    friends.push({
      roomId: doc.data().roomId,
      uid: doc.data().uid,
      username: user,
    })
  }

  return friends
}

/**
 * 友達の名前を取得
 * @param roomId
 * @returns username(friend)
 */
export const getFriendNameByRoomId = async (args: { roomId: string }) => {
  const roomInfo = await getRoomInfoByRoomId({ roomId: args.roomId })
  const user = auth.currentUser
  const friendUid = roomInfo.uid1 === user!.uid ? roomInfo.uid2 : roomInfo.uid1

  const result = await getUserInfoByUid({ uid: friendUid })
  return result?.username
}
