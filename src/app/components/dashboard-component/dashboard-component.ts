import { Component, inject} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData } from 'chart.js';
import { AdminService } from '../../services/admin-service/admin-service';
import { Task } from '../../model/Task';
import { MatIconModule } from '@angular/material/icon';
import { MenuComponent } from '../menu-component/menu-component';




@Component({
  selector: 'app-dashboard-component',
  imports: [BaseChartDirective,MatIconModule,MenuComponent],
  templateUrl:'./dashboard-component.html' ,
  styleUrl:'./dashboard-component.css'
})
export class DashboardComponent {
  tasks:Task[]=[]
  service=inject(AdminService)

  totalTasks = 0
  tasksCompleted = 0
  tasksPending= 0
  tasksInProgress = 0  
  tasksOverdue=0

  ngOnInit() {
    this.service.getTasks().subscribe(data => {
      this.tasks = data; 
      this.calculateTotals();
      this.updateChartData();
    });
  }

  updateChartData() {
    this.pieChartData = {
      labels: ['PENDING','IN PROGRESS','COMPLETED','OVERDUE'],
      datasets: [{
        data: [
          this.tasksPending,
          this.tasksInProgress, 
          this.tasksCompleted,
          this.tasksOverdue
        ],
      }]
    };
  }

  calculateTotals() {
    this.totalTasks = 0;
    this.tasksCompleted = 0;
    this.tasksInProgress = 0;
    this.tasksPending = 0;
    this.tasksOverdue=0

    for (const task of this.tasks) {
      
      this.totalTasks+= 1;
      
      switch(task.status) {
        case 'PENDING':
          this.tasksPending += 1;
          break;
        case 'IN_PROGRESS':
          this.tasksInProgress += 1;
          break;
        case 'COMPLETED':
          this.tasksCompleted +=1;
          break;
        case 'OVERDUE':
          this.tasksOverdue+=1
      }
    }
  }


  pieChartData:ChartData<'pie'>={
    labels:['PENDING','IN PROGRESS','COMPLETED','OVERDUE'],
    datasets:[
      {
        data:[0, 0, 0,0]
      }
    ]
  }

}
