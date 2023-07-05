import { User } from '@/common/models/user.type'

export type Chat = {
  chatId: string
  listOfUser: User[]
}
