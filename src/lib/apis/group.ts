import { collection, doc, getDocs, setDoc } from 'firebase/firestore'

import { auth, db, master } from '@/lib/config'

/**
 * グループを登録
 * @param roomId
 * @param groupName
 * @param groupMember
 * @returns
 */
export const registerGroup = async (args: {
  roomId: string
  groupName: string
  groupMember: string[]
}) => {
  const user = auth.currentUser
  const docRef = doc(db, master, 'users', user!.uid, 'groups', args.roomId)

  await setDoc(docRef, {
    roomId: args.roomId,
    groupName: args.groupName,
  }).then(() => {
    args.groupMember.forEach(async (member) => {
      const docRef = doc(db, master, 'users', member, 'groups', args.roomId)
      await setDoc(docRef, {
        roomId: args.roomId,
        groupName: args.groupName,
      })
    })
  })
}

/**
 * ユーザ所属のグループ情報を取得
 * @param uid
 * @returns { roomId: string; groupName: string }[]
 */
export const getAllGroupsByUid = async () => {
  const user = auth.currentUser
  const colRef = collection(db, master, 'users', user!.uid, 'groups')
  const querySnapshot = await getDocs(colRef).then((querySnapshot) => {
    const result: { roomId: string; groupName: string }[] =
      querySnapshot.docs.map((doc) => {
        return {
          roomId: doc.data().roomId,
          groupName: doc.data().groupName,
        }
      })
    return result
  })
  return querySnapshot
}
