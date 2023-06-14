import { addDoc, collection, serverTimestamp } from 'firebase/firestore'

import { db, master } from '@/lib/config'

/**
 * メッセージ登録
 * @param message
 * @param roomId
 * @param uid
 */
export const registerChat = async (args: {
  message: string
  roomId: string
  uid: string
}) => {
  const colRef = collection(db, master, 'rooms', args.roomId, 'chats')
  await addDoc(colRef, {
    message: args.message,
    uid: args.uid,
    sentAt: serverTimestamp(),
  })
}
