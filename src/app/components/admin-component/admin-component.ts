import { Component, inject,  ViewChild } from '@angular/core';
import { TaskService } from '../../services/task-service/task-service';
import { Task } from '../../model/Task';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule, NgIf } from '@angular/common';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { AdminService } from '../../services/admin-service/admin-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { JwtUser } from '../login-component/login-component';
import { jwtDecode } from 'jwt-decode';
import { User } from '../../model/User';
import { UserService } from '../../services/user-service/user-service';


@Component({
  selector: 'app-admin-component',
  imports: [FormsModule, MatInputModule, MatTableModule, NgIf ,
  MatSortModule,MatPaginator,MatSelectModule,MatInputModule,MatIconModule,
  MatMenuModule,MatBadgeModule,CommonModule ,MatMenuModule ,RouterLink],
  templateUrl: './admin-component.html',
  styleUrl: './admin-component.css'
})
export class AdminComponent {
 displayedColumns: string[] = ['id', 'title', 'description','status','deadline'];
  service=inject(AdminService);
  taskService=inject(TaskService)

  tasks:Task[]=[];
  searchId?:number|null;
  task?:Task = {
    title: '',
    description:'',
    status:''   
  }
  addedTask?:Task = {
    title: '',
    description:'',
    status:''   
  }
  deletedId?:number|null
  userId?:number|null
  taskId?:number|null
  status?:string|null
  filteredTasks:Task[]=[]
  minDate=new Date()
  taskIds:number[]=[]

  users:User[]=[]
  userIds:number[]=[]
  userService=inject(UserService)

  
  getTasks(){
    this.service.getTasks().subscribe(data=>{
      this.tasks=data;
      this.dataSource.data = this.tasks;
      
      if (this.sort1) {
        this.dataSource.sort = this.sort1;
      }
      this.dataSource.paginator = this.paginator1;

      this.taskIds=[]
      for(const t of this.tasks){
      if (t.id){this.taskIds.push(t.id)}
    }
    });
    this.isTableVisible1 =true;
    this.isTableVisible2 = false;
    this.isTableVisible3=false;
    this.isTableVisible4=false;
    this.displayPlaceholder1=true
    this.displayPlaceholder2=true
    this.searchId=0
    this.status=null
  }

  getTask(){
    this.service.getTask(this.searchId).subscribe(data=>{
      this.task=data;
    });
    this.isTableVisible2 = true;
    this.isTableVisible1=false;
    this.isTableVisible3=false;
    this.isTableVisible4=false;
    this.displayPlaceholder1=false;
  }

  getTasksByStatus(){
    this.service.getTasksByStatus(this.status).subscribe(data=>{
      this.filteredTasks=data;
      this.dataSource1.data = this.filteredTasks;
      if (this.sort2) {
        this.dataSource1.sort = this.sort2;
      }
      this.dataSource1.paginator = this.paginator2;
    });
    this.isTableVisible2 = false;
    this.isTableVisible1=false;
    this.isTableVisible3=true;
    this.isTableVisible4=false;
    this.displayPlaceholder2=false
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
    }else if(this.taskId&&!this.taskIds.includes(this.taskId)){
      this.snackBar.open("no task found with that id","close",{panelClass:['snackbar'],duration:2000},);
      this.userId=null
      this.taskId=null
    }else{
    this.service.assignTaskToUser(this.userId, this.taskId).subscribe(data => {
      this.assignedSnackbar(this.userId,this.taskId)
      this.userId=null
      this.taskId=null
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
    })
  }
  deleteTask() {
    if (this.user.roles&&(this.user.roles[0]!="ROLE_ADMIN")) {
      this.snackBar.open("You Don't Have The Permission To Modify Tasks ","close",{panelClass:['snackbar'],duration:2000},);     
      this.deletedId=null
    }else if(this.deletedId&&!this.taskIds.includes(this.deletedId)){
      this.snackBar.open("no task found with that id","close",{panelClass:['snackbar'],duration:2000},);
      this.deletedId=null
    }else{
    this.service.deleteTask(this.deletedId).subscribe(data => {this.removeSnackbar(this.deletedId),this.deletedId=null});
    }
  }
  


  isTableVisible1: boolean = false;
  isTableVisible2: boolean = false;
  isTableVisible3: boolean = false;
  isTableVisible4: boolean = false;

  @ViewChild(MatSort) sort1!: MatSort;
  @ViewChild(MatSort) sort2!: MatSort;
  @ViewChild(MatPaginator) paginator1!: MatPaginator;
  @ViewChild(MatPaginator) paginator2!: MatPaginator;
  dataSource: MatTableDataSource<Task> ;
  dataSource1: MatTableDataSource<Task> ;


  constructor(private snackBar:MatSnackBar) {
    this.getTasks()
    this.userIds=[]
    this.userService.getUsers().subscribe(data=>{
      this.users=data;
      for(const u of this.users){
        if(u.id){this.userIds.push(u.id)}
      }})
    this.dataSource = new MatTableDataSource(this.tasks);
    this.dataSource1 = new MatTableDataSource(this.filteredTasks);
  
  }
  
  ngAfterViewInit() {
    this.dataSource.sort = this.sort1;
    this.dataSource1.sort = this.sort2;
    this.dataSource.paginator = this.paginator1;
    this.dataSource1.paginator = this.paginator2;
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




  statusChange(selectedValue: string) {
      if (selectedValue === '') {
       this.getTasks(); 
       this.displayPlaceholder2=true
      } else {
        this.getTasksByStatus();
        this.displayPlaceholder2=false
      }
    }   
    idChange(selectedValue: number) {
      if (selectedValue == 0) {
       this.getTasks();
       this.displayPlaceholder1=true
      } else {
        this.getTask();
        this.displayPlaceholder1=false
      }
    }   
    displayPlaceholder1:boolean=true
    displayPlaceholder2:boolean=true

    numbers = new Array(100).fill(0).map((_, i) => i + 1);

    token=localStorage.getItem('token')??'';
    user=jwtDecode<JwtUser>(this.token);
}
    
