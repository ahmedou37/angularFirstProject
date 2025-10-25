import { inject, Injectable } from '@angular/core';
import { Task } from '../../model/Task';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
 url='http://localhost:8080/tasks';
  http=inject(HttpClient);

  getTasks(){
    return this.http.get<Task[]>(this.url);
  }
  getTask(id:number|any){
    return this.http.get<Task>(`${this.url}/${id}`);
  }
  getTasksByStatus(status:string|any){
    return this.http.get<Task[]>(`${this.url}/filter`,{params: {status:status}});
  }
  addTask(task:Task|any){
    return this.http.post<Task>(this.url,task);
  }
  deleteTask(id:number|any){
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
  assignTaskToUser(userId:number|any,taskId:number|any){
    return this.http.post(`${this.url}/${userId}/${taskId}`,null, { responseType: 'text' });
  }
}
