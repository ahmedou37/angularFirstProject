import { Component, inject,  ViewChild } from '@angular/core';
import { TaskService } from '../../services/task-service/task-service';
import { Task } from '../../model/Task';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin-service/admin-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtUser } from '../login-component/login-component';
import { jwtDecode } from 'jwt-decode';
import { User } from '../../model/User';
import { UserService } from '../../services/user-service/user-service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TooltipModule } from 'primeng/tooltip';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MenuComponent } from '../menu-component/menu-component';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, themeQuartz } from 'ag-grid-community';
import { CellComponent, DialogOpener } from '../cell-component/cell-component';


@Component({
  selector: 'app-admin-component',
  imports: [FormsModule,CommonModule,ButtonModule,InputTextModule
   ,DialogModule,SelectModule,TableModule,AutoCompleteModule ,
   TooltipModule ,FloatLabelModule ,MenuComponent,
   AgGridAngular
  ],
  templateUrl: `./admin-component.html`,
  styleUrl: './admin-component.css'
})
export class AdminComponent implements DialogOpener {
 displayedColumns: string[] = ['id', 'title', 'description','status','deadline'];
  service=inject(AdminService);
  taskService=inject(TaskService)

  tasks:Task[]=[];

  addedTask?:Task = {
    title: '',
    description:'',
    status:'PENDING'   
  }
  deletedId?:number|null
  userId?:number|null
  taskId?:number|null
  minDate=new Date()
  taskIds:number[]=[]

  users:User[]=[]
  userIds:number[]=[]
  userName:string=''
  userNames:string[]=[]
  userService=inject(UserService)

  statuses:string[]=['COMPLETED','OVERDUE','IN_PROGRESS','PENDING']

  theme=themeQuartz

  colDefault:ColDef={
    flex:1,
    filter:true,
    floatingFilter:true,
    cellStyle: {'border-right-color': '#e2e2e2','display':'flex','justify-content':'center'}
  }
  colDef: ColDef[] = [
    { field:'id' },
    { field: 'title' },
    { field:'description',
      flex:1.3
    },
    { 
    
  field: 'assignedUser',
  headerName: 'Assigned User',
  cellRenderer:CellComponent,
  cellRendererParams: (params: any) => ({
    type:'assign',
    rowData: params.data,
        parent:this
  })
},

    { field:'status',
      valueFormatter: (p) => {
  if (p.value === 'IN_PROGRESS') {
    return 'IN PROGRESS';
  }
  return p.value;
}
     },
    { field: 'deadline' ,
      cellRenderer:CellComponent,
      cellRendererParams:(p:any)=>({
        type:'delete',
        rowData:p.data,
        parent:this
      }),
      suppressSizeToFit: true,
        autoHeight: true
    }
  ];
  pageSize=7
  pageSizeSelector=[7,10,15]


  
  getTasks(){
      this.service.getTasks().subscribe(data=>{
      this.tasks=data;
      this.tasks.forEach(i=>{if(i.id){this.taskIds.push(i.id)}})
      this.taskIds=[]
      for(const t of this.tasks){
        if (t.id){this.taskIds.push(t.id)}
      }
    });
  }


  assigneTaskToUser() { 
    if (this.user.roles&&(this.user.roles[0]!="ROLE_ADMIN")) {
      this.snackBar.open("You Don't Have The Permission To Modify Tasks ","close",{panelClass:['snackbar'],duration:2000},);  
      this.userId=null
      this.taskId=null   
    }else if(this.userId&&!this.userIds.includes(this.userId)){
      this.snackBar.open("no user found with that id","close",{panelClass:['snackbar'],duration:2000},);
      this.userId=null
      this.taskId=null
    }else{
    this.service.assignTaskToUser(this.userName, this.taskId).subscribe(data => {
      this.assignedSnackbar(this.userId,this.taskId)
      this.userName=''
      this.assigneVisible=false
      this.getTasks()
      this.closeDialog()
     });
    }
  }

  addTask(){
    if (this.user.roles&&(this.user.roles[0]!="ROLE_ADMIN")) {
      this.snackBar.open("You Don't Have The Permission To Modify Tasks ","close",{panelClass:['snackbar'],duration:2000},);
      if(this.addedTask?.title){this.addedTask.title=''}
      if(this.addedTask?.description){this.addedTask.description=''}
      if(this.addedTask?.status){this.addedTask.status=''}     
    }
    
    this.service.addTask(this.addedTask).subscribe(data=>{
      this.addSnackbar(this.addedTask?.title)
      if(this.addedTask?.title){this.addedTask.title=''}
      if(this.addedTask?.description){this.addedTask.description=''}
      if(this.addedTask?.status){this.addedTask.status=''}
      this.addVisible=false
      this.getTasks()
      this.closeDialog()
    })
  }
  deleteTask() {
    this.deletedId=Number(this.deletedId)
    if (this.user.roles&&(this.user.roles[0]!="ROLE_ADMIN")) {
      this.snackBar.open("You Don't Have The Permission To Modify Tasks ","close",{panelClass:['snackbar'],duration:2000},);     
      this.deletedId=null
    }else{
    this.service.deleteTask(this.deletedId).subscribe(data => {
      this.removeSnackbar(this.deletedId),console.log("this.deltedId",this.deletedId),this.deletedId=null
      this.deleteVisible=false;
      this.closeDialog()
      this.getTasks()
    });
    }
  }


 constructor(private snackBar:MatSnackBar) {
    this.getTasks()
    this.userIds=[]
    this.userNames=[]
    this.userService.getUsers().subscribe(data=>{
    this.users=data;
    this.users.forEach(i=>{if(i.id){this.userIds.push(i.id)}})
    this.users.forEach(i=>{if(i.name){this.userNames.push(i.name)}})
    }) 
  }

  getImageUrl(imageName:string){
    return this.userService.getImageUrl(imageName)
  }


  assignedSnackbar(userId:number|any,taskId:number|any){
    this.snackBar.open(`Task Assigned with id ${taskId}  to the User with id ${userId}`,`close`,{
      duration:4000,
      panelClass:['Snackbar']
    })
  }
  addSnackbar(title:string|any){
    this.snackBar.open(`Task Added with tite ${title}`,`close`,{
      duration:4000,
      panelClass:['Snackbar']
    })
  }
  removeSnackbar(id: number | any) {
  this.snackBar.open(`Task Deleted with id ${id}`, 'close', { 
    duration: 4000,
    panelClass:['Snackbar']
   });
  }

   

    numbers = new Array(100).fill(0).map((_, i) => i + 1);

    token=localStorage.getItem('token')??'';
    user=jwtDecode<JwtUser>(this.token);


    addVisible=false
    assigneVisible=false
    deleteVisible=false

    showDeleteDialog(deletedId:number){
      this.deletedId=deletedId
      this.deleteVisible=true
    }
    showAssigneDialog(taskId:number){
      this.taskId=taskId
      this.assigneVisible=true
    }
    







  dialogVisible = false;
  dialogType: string | null = null;

  openDialog(type: string,id:number|null=null) {
    this.dialogType = type;
    if(this.dialogType=='assign'){
      this.taskId=id
      this.assigneVisible=true
    }
    if(this.dialogType=='delete'){
      this.deletedId=id
      this.deleteVisible=true
    }
    if(this.dialogType=='add'){
      this.addVisible=true
    }
  }

closeDialog() {
  this.dialogVisible = false;
  this.dialogType = null;
}

getHeader() {
  switch (this.dialogType) {
    case 'assign': return 'Assign Task To User';
    case 'delete': return 'Delete Task';
    case 'add': return 'Add New Task';
    default: return '';
  }
}

}
    
