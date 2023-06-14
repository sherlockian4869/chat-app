import { addDoc, collection } from 'firebase/firestore'

import { User } from '@/app/common/models/user.type'
import { db, master } from '@/lib/config'

export const registerGroup = async (args: {
  groupName: string
  groupMember: User[]
}) => {
  const colRef = collection(db, master, 'groups')
  const members = args.groupMember.map((member) => {
    return {
      uid: member.uid,
    }
  })
  await addDoc(colRef, {
    groupName: args.groupName,
    groupMember: members,
  }).then(() => {
    return true
  })
  return false
}
