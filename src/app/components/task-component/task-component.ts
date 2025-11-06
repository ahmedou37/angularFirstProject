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
import { Notification } from '../../model/Notifications';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { Subscription } from 'rxjs';
import { WebsocketService } from '../../services/socket-service/socket-service';
import { RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-task-component',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatTableModule, NgIf ,
  MatSortModule,MatPaginator,MatSelectModule,MatInputModule,MatIconModule,
  MatMenuModule,MatBadgeModule,CommonModule ,MatMenuModule ,RouterLink],
  templateUrl: './task-component.html',
  styleUrls: ['./task-component.css']
})
export class TaskComponent {
  displayedColumns: string[] = ['id', 'title', 'description','status','deadline'];
  service=inject(TaskService);

  tasks:Task[]=[];
  searchId?:number;
  task?:Task = {
    title: '',
    description:'',
    status:''
    
    }
  status:string|null=null
  filteredTasks:Task[]=[]

  updatedStatus:string|null=''
  updatedId?:number|null
  updatedTask:Task={
    title:'',
    description:'',
    status:''
  }


  getTasks(){
    this.service.getTasks().subscribe(data=>{
      this.tasks=data;
      this.dataSource.data = this.tasks;
      if (this.sort1) {
        this.dataSource.sort = this.sort1;
      }
      this.dataSource.paginator = this.paginator1;
    });
    this.status=null;
    this.searchId=0
    this.isTableVisible1 = true;
    this.isTableVisible2=false;
    this.isTableVisible3=false;
    this.isTableVisible4=false;
    this.displayPlaceholder1=true;
    this.displayPlaceholder2=true;
    this.displayPlaceholder3=true
  }

  getTask(){
    this.service.getTask(this.searchId).subscribe(data=>{
    this.task=data;
    this.isTableVisible1=false
    this.isTableVisible3=false
    this.isTableVisible2=true
    this.isTableVisible4=false
    });
  }

  getTasksByStatus(){
    this.service.getTasksByStatus(this.status).subscribe(data=>{
      this.filteredTasks=data;
      this.isTableVisible1=false;
      this.isTableVisible2=false;
      this.isTableVisible3 = true;
      this.isTableVisible4=false
      this.dataSource1.data = this.filteredTasks;
      if (this.sort2) {
        this.dataSource1.sort = this.sort2;
      }
      this.dataSource1.paginator = this.paginator2;
    });
  }
  taskIds:number[]=[]
  updateTaskStatus(){
    for(const t of this.tasks){
      if (t.id){this.taskIds.push(t.id)}
    }
    if(this.updatedId&&this.taskIds.includes(this.updatedId)){
    this.service.updateTaskStatus(this.updatedId,this.updatedStatus).subscribe(data=>{
      this.updatedTask=data;
      this.displayPlaceholder3=false
      this.isTableVisible4 =true;
     this.isTableVisible1=false;
    this.isTableVisible2=false;
    this.isTableVisible3=false;  
    });
    }
    else{
      this.errorSnackbar()
    }
    this.updatedId=null
    this.updatedStatus=null;
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

  constructor(private websocketService: WebsocketService ,private  snackbar:MatSnackBar) {
    this.getTasks()
    this.dataSource = new MatTableDataSource(this.tasks);
    this.dataSource1 = new MatTableDataSource(this.filteredTasks);
  }
  
  ngAfterViewInit() {
    this.dataSource.sort = this.sort1;
    this.dataSource1.sort = this.sort2;
    this.dataSource.paginator = this.paginator1;
    this.dataSource1.paginator = this.paginator2;
  }

  
    isNotVisible:boolean=false
    notification?:Notification={
      name:'',
      seen:false
    }
    notifications:Notification[]=[];
    unseenNotifications:Notification[]=[]
  
    getNotification(){
      this.service.getNotifications().subscribe(data=>
        {this.notifications=data;
         this.notifications.forEach((not)=>{if(not.seen==false){this.notLenght+=1}})
        })
    }
  
    getUnseenNotification(){
      //this.getNotification()
      this.isNotVisible=!this.isNotVisible
      this.service.getUnseenNotifications().subscribe(data=>{this.unseenNotifications=data,
      //this.notifications?.forEach(not=>{not.seen=true}),
      this.notLenght=0
      this.service.setToSeen().subscribe(()=>this.service.resetNotLength())
      })
    }
    isUnseen(notification: Notification): boolean {
      return this.unseenNotifications.some(unseen => 
        unseen.id === notification.id
      );
    }
    notLenght:number=0

    ngOnInit() {
      this.getNotification()
      this.websocketService.connect();

      this.sub = this.websocketService.notifications$.subscribe((notif) => {//declare this subscribtion so i can desactivate it later
      this.notifications.push(notif);
      this.notLenght+=1;
    })
    }
   
    private sub!: Subscription;
    
    ngOnDestroy() {
      this.sub.unsubscribe();
      this.websocketService.disconnect();
    }


    numbers = new Array(100).fill(0).map((_, i) => i + 1);

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
    displayPlaceholder3:boolean=true


    errorSnackbar(){
      this.snackbar.open("no task found with that id ","close",{
        duration:3000,
        panelClass:"snackbar"
      })
    }
   
}
