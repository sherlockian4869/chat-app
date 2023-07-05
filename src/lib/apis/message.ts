import { addDoc, collection, serverTimestamp } from 'firebase/firestore'

import { db, master } from '@/lib/config'

/**
 * メッセージ登録
 * @param message
 * @param chatId
 * @param uid
 */
export const registerMessage = async (args: {
  message: string
  chatId: string
  uid: string
}) => {
  const colRef = collection(db, master, 'chats', args.chatId, 'messages')
  await addDoc(colRef, {
    message: args.message,
    uid: args.uid,
    sentAt: serverTimestamp(),
  })
}
