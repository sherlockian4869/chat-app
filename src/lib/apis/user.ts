import { collection, doc, getDoc, getDocs } from 'firebase/firestore'

import { auth, db, master } from '@/lib/config'

/**
 * 全てのユーザ情報を取得
 * @returns { uid: string; username: string }[]
 */
export const getAllUserInfo = async () => {
  const userRef = collection(db, master, 'users')
  const result = await getDocs(userRef).then((querySnapshot) => {
    const result: { uid: string; username: string }[] = []
    querySnapshot.forEach((doc) => {
      result.push({
        uid: doc.data().uid,
        username: doc.data().username,
      })
    })
    return result
  })
  return result
}

/**
 * ユーザ情報検索
 * @param search
 * @returns { uid: string; username: string }[]
 */
export const searchUser = async (args: { search: string }) => {
  const userInfo = await getAllUserInfo()
  const result: { uid: string; username: string }[] = userInfo.filter(
    (user) => {
      return (
        user.uid.includes(args.search) ||
        (user.username.includes(args.search) &&
          !user.uid.includes(auth.currentUser!.uid))
      )
    }
  )
  return result
}

/**
 * ユーザ情報取得
 * @param uid
 * @returns userinfo
 */
export const getUserInfoByUid = async (args: { uid: string }) => {
  const docRef = doc(db, master, 'users', args.uid)
  const result = await getDoc(docRef).then((doc) => {
    if (doc.exists()) {
      return {
        uid: doc.data().uid,
        username: doc.data().username,
      }
    }
  })
  return result
}
