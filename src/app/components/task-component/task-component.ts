import { Component, inject } from '@angular/core';
import { TaskService } from '../../services/task-service/task-service';
import { Task } from '../../model/Task';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Notification } from '../../model/Notifications';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { Subscription } from 'rxjs';
import { WebsocketService } from '../../services/socket-service/socket-service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TooltipModule } from 'primeng/tooltip';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MenuComponent } from '../menu-component/menu-component';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, themeQuartz } from 'ag-grid-community';
import { CellComponent, DialogOpener } from '../cell-component/cell-component';




@Component({
  selector: 'app-task-component',
  standalone: true,
  imports: [FormsModule,MatIconModule,MatMenuModule,MatBadgeModule,
  ButtonModule,InputTextModule,DialogModule,SelectModule,TableModule,
  AutoCompleteModule ,TooltipModule ,FloatLabelModule,MenuComponent,
  OverlayBadgeModule,BadgeModule,CommonModule,AgGridAngular],
  templateUrl: './task-component.html',
  styleUrls: ['./task-component.css']
})
export class TaskComponent implements DialogOpener{
  displayedColumns: string[] = ['id', 'title', 'description','status','deadline'];
  service=inject(TaskService);

  tasks:Task[]=[];

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
      { field:'description'},  
      { field:'status',
       cellRenderer:CellComponent,
       cellRendererParams: (params: any) => ({
          type:'edite',
          rowData: params.data,
        parent:this
        }),
        suppressSizeToFit: true,
        autoHeight: true
      },
      { field: 'deadline' }
      
    ];
    pageSize=7
    pageSizeSelector=[7,10,15]

  


  updatedStatus:string|null=''
  updatedId?:number|null
  updatedTask:Task={
    title:'',
    description:'',
    status:''
  }

  taskIds:number[]=[]

  statuses:string[]=['COMPLETED','OVERDUE','IN_PROGRESS','PENDING']


  getTasks(){
    this.service.getTasks().subscribe(data=>{
      this.tasks=data;
    });
  }

 

  updateTaskStatus(){
    for(const t of this.tasks){
      if (t.id){this.taskIds.push(t.id)}
    }
    if(this.updatedId&&this.taskIds.includes(this.updatedId)){
    this.service.updateTaskStatus(this.updatedId,this.updatedStatus).subscribe(data=>{
      this.updatedTask=data;
      this.dialogVisible=false
      this.getTasks()
    });
    }
    else{
      this.errorSnackbar()
    }
    this.updatedId=null
    this.updatedStatus=null;
  }



  constructor(private websocketService: WebsocketService ,private  snackbar:MatSnackBar) {
    this.getTasks() 
  }
  

    notLenght:number=0
    isNotVisible:boolean=false
    notification?:Notification={
      name:'',
      seen:false
    }
    notifications:Notification[]=[];
    unseenNotifications:Notification[]=[]
  
    getNotification(){
      this.service.getNotifications().subscribe(data=>{
        this.notifications=data;
        this.notifications.forEach((not)=>{if(not.seen==false){this.notLenght+=1}})
      })
    }
  
    getUnseenNotification(){
      this.isNotVisible=!this.isNotVisible
      this.service.getUnseenNotifications().subscribe(data=>{this.unseenNotifications=data,
      this.notLenght=0
      this.service.setToSeen().subscribe(()=>this.service.resetNotLength())
      })
    }
    isUnseen(notification: Notification): boolean {
      return this.unseenNotifications.some(unseen => 
        unseen.id === notification.id
      );
    }

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

    

    errorSnackbar(){
      this.snackbar.open("no task found with that id ","close",{
        duration:3000,
        panelClass:"snackbar"
      })
    }
 
    dialogVisible=false

  openDialog(type:string,id:number){
    this.updatedId=id
    this.dialogVisible=true
  }
   
}
