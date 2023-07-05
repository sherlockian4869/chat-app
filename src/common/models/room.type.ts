import { User } from '@/common/models/user.type'

export type Room = {
  roomId: string
  listOfUser: User[]
}
