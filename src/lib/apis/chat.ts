import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore'

import { Chat } from '@/common/models/chat.type'
import { User } from '@/common/models/user.type'
import { addFriend } from '@/lib/apis/friend'
import { getUsersInfoByUidList } from '@/lib/apis/user'
import { auth, db, master } from '@/lib/config'

/**
 * チャットルームを登録 (個人)
 * @param friendUid
 */
export const registerChatFromFriend = async (args: { friendUid: string }) => {
  const user = auth.currentUser
  const colRef = collection(db, master, 'chats')
  // 配列型でfirestoreに登録
  const uidList = [user!.uid, args.friendUid]
  await addDoc(colRef, {
    chatId: colRef.id,
    listOfUid: uidList,
  }).then((docRef) => {
    addFriend({ chatId: docRef.id, friendUid: args.friendUid })
  })
}

/**
 * ルーム情報の取得
 * @param chatId
 * @returns chatInfo
 */
export const getChatInfoByChatId = async (args: { chatId: string }) => {
  const docRef = doc(db, master, 'chats', args.chatId)
  const result: Chat = await getDoc(docRef).then(async (doc) => {
    const userList: User[] = await getUsersInfoByUidList({
      uidList: doc.data()!.listOfUid,
    })
    return {
      chatId: doc.data()!.chatId,
      listOfUser: userList,
    }
  })
  return result
}
