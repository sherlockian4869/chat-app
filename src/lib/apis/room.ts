import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore'

import { addFriend } from '@/lib/apis/friend'
import { auth, db, master } from '@/lib/config'

/**
 * チャットルームを登録 (roomIdは自動で付与)
 * @param uid1
 * @param uid2
 */
export const registerRoom = async (args: { friendUid: string }) => {
  const user = auth.currentUser
  const colRef = collection(db, master, 'rooms')
  await addDoc(colRef, {
    uid1: user!.uid,
    uid2: args.friendUid,
  }).then((docRef) => {
    updateDoc(docRef, {
      roomId: docRef.id,
    }).then(() => {
      addFriend({ roomId: docRef.id, friendUid: args.friendUid })
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
  const result = await getDoc(docRef).then((doc) => {
    return {
      roomId: doc.data()!.roomId,
      uid1: doc.data()!.uid1,
      uid2: doc.data()!.uid2,
    }
  })
  return result
}
