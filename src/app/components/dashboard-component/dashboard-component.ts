import { Component, inject} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { AdminService } from '../../services/admin-service/admin-service';
import { Task } from '../../model/Task';




@Component({
  selector: 'app-dashboard-component',
  imports: [BaseChartDirective],
  template: `
      <h2 class="h1">Tasks By Status:</h2>
      <div class="piechart">
        <canvas baseChart
          [data]="pieChartData"
          [type]="'pie'">
        </canvas>
      </div>
      <h2 class="h2">Total Tasks Numbers : {{totalTasks}}</h2>
  `,
  styles:[`
    .h2{
      display: flex;
      justify-content: center; /*Centers horizontally */
      /*align-items: center;    Centers vertically */
      margin: 50px; 
      padding-top:50px;
    }
    .piechart{
      display:flex;
      padding:30px;
      margin-top:0px;
      align-items:center;
      justify-content:center
    }
    .h1{
      margin-top:15px;
      margin-bottom:0px;
    }
  `]
})
export class DashboardComponent {
  tasks:Task[]=[]
  service=inject(AdminService)

  totalTasks = 0
  tasksCompleted = 0
  tasksPending= 0
  tasksInProgress = 0  

  ngOnInit() {
    this.service.getTasks().subscribe(data => {
      this.tasks = data; 
      this.calculateTotals();
      this.updateChartData();
    });
  }

  updateChartData() {
    this.pieChartData = {
      labels: ['PENDING','IN PROGRESS','COMPLETED'],
      datasets: [{
        data: [
          this.tasksPending,
          this.tasksInProgress, 
          this.tasksCompleted,
        ],
      }]
    };
  }

  calculateTotals() {
    this.totalTasks = 0;
    this.tasksCompleted = 0;
    this.tasksInProgress = 0;
    this.tasksPending = 0;

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
      }
    }
  }


  pieChartData:ChartData<'pie'>={
    labels:['PENDING','IN PROGRESS','COMPLETED'],
    datasets:[
      {
        data:[0, 0, 0]
      }
    ]
  }

}
