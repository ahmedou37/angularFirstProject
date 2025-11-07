export type User={
    id?:number,
    name:string,
    password:string,
    role?:string,
    email:string,
    imageName?:string,
    tasks?:[],
    notification?:[]
}