import { User } from "./User"

export type Task ={
    id?:number,
    title:string,
    description:string,
    status:string,
    deadline?:Date,
    assignedUser?:User
}