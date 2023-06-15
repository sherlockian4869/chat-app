import { User } from '@/app/common/models/user.type'

export type Room = {
  roomId: string
  listOfUser: User[]
}
