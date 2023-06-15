import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore'

import { User } from '@/app/common/models/user.type'
import { auth, db, master } from '@/lib/config'

/**
 * 全てのユーザ情報を取得
 * @returns User[]
 */
export const getAllUserInfo = async () => {
  const userRef = collection(db, master, 'users')
  const result = await getDocs(userRef).then((querySnapshot) => {
    const result: User[] = []
    querySnapshot.forEach((doc) => {
      result.push({
        uid: doc.data().uid,
        username: doc.data().username,
        email: doc.data().email,
        photoURL: doc.data().photoURL,
      })
    })
    return result
  })
  return result
}

/**
 * ユーザ情報検索
 * @param search
 * @returns User[]
 */
export const searchUser = async (args: { search: string }) => {
  const userInfo = await getAllUserInfo()
  const result: User[] = userInfo.filter((user) => {
    return (
      user.uid.includes(args.search) ||
      (user.username.includes(args.search) &&
        !user.uid.includes(auth.currentUser!.uid))
    )
  })
  return result
}

/**
 * 単一ユーザ情報取得
 * @param uid
 * @returns User
 */
export const getUserInfoByUid = async (args: { uid: string }) => {
  const docRef = doc(db, master, 'users', args.uid)
  const result: User = await getDoc(docRef).then((doc) => {
    return {
      uid: doc.data()!.uid,
      username: doc.data()!.username,
      email: doc.data()!.email,
      photoURL: doc.data()!.photoURL,
    } as User
  })
  return result
}

/**
 * 複数ユーザ情報取得
 * @param uidList
 * @returns User[]
 */
export const getUsersInfoByUidList = async (args: { uidList: string[] }) => {
  const colRef = collection(db, master, 'users')
  const q = query(colRef, where('uid', 'in', args.uidList))
  const result = await getDocs(q).then((querySnapshot) => {
    const result: User[] = []
    querySnapshot.forEach((doc) => {
      result.push({
        uid: doc.data().uid,
        username: doc.data().username,
        email: doc.data().email,
        photoURL: doc.data().photoURL,
      })
    })
    return result
  })
  return result
}
