import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'

import { auth, db, master } from '@/lib/config'

/**
 * google signin
 * @returns boolean
 */
export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  try {
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    const docRef = doc(db, master, 'users', user.uid)

    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      await updateDoc(docRef, {
        uid: user.uid,
        username: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      })
    } else {
      await setDoc(docRef, {
        uid: user.uid,
        username: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        deletedAt: null,
      })
    }
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

/**
 * logout
 */
export const logout = async () => {
  await signOut(auth)
    .then(() => {
      console.log('ログアウトしました')
    })
    .catch((error) => {
      console.log(`ログアウト時にエラーが発生しました (${error})`)
    })
}
