import { Component, inject, ViewChild } from '@angular/core';
import { TaskService } from '../../services/task-service/task-service';
import { Task } from '../../model/Task';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgIf } from '@angular/common';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { AdminService } from '../../services/admin-service/admin-service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
@Component({
  selector: 'app-admin-component',
  imports: [FormsModule, MatButton, MatInputModule, MatTableModule, NgIf ,
  MatSortModule,MatPaginator,MatSelectModule,MatInputModule,MatSnackBarModule,
  MatDatepickerModule],
  templateUrl: './admin-component.html',
  styleUrl: './admin-component.css'
})
export class AdminComponent {
 displayedColumns: string[] = ['id', 'title', 'description','status','deadline'];
  service=inject(AdminService);
  taskService=inject(TaskService)

  tasks:Task[]=[];
  searchId?:number;
  task?:Task = {
    title: '',
    description:'',
    status:''   
  }
  addedTask?:Task = {
    title: '',
    description:'',
    status:'PENDING'   
  }
  deletedId?:number
  userId?:number
  taskId?:number
  status:string='PENDING'
  filteredTasks:Task[]=[]
  minDate=new Date()

  
  getTasks(){
    this.service.getTasks().subscribe(data=>{
      this.tasks=data;
      this.dataSource.data = this.tasks;
      
      if (this.sort1) {
        this.dataSource.sort = this.sort1;
      }
      this.dataSource.paginator = this.paginator1;
    });
   this.isTableVisible1 = !this.isTableVisible1;
  }

  getTask(){
    this.service.getTask(this.searchId).subscribe(data=>{
      this.task=data;
    });
    this.isTableVisible2 = !this.isTableVisible2;
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
    this.isTableVisible3 = !this.isTableVisible3;
  }
  assigneTaskToUser() {
    this.service.assignTaskToUser(this.userId, this.taskId).subscribe(data => {
      this.assignedSnackbar(this.userId,this.taskId)
      //this.taskService.incrementNotLength()
     // this.taskService.getNotLenght()
     });
  }
  addTask(){
    this.service.addTask(this.addedTask).subscribe(data=>{this.addSnackbar(this.addedTask?.title)})
  }
  deleteTask() {
    this.service.deleteTask(this.deletedId).subscribe(data => {this.removeSnackbar(this.deletedId)});
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

}
