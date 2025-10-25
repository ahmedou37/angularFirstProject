import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Task } from '../../model/Task';
import { Notification } from '../../model/Notifications';
import { BehaviorSubject, count, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  url='http://localhost:8080/users/tasks';
  http=inject(HttpClient);

  private notLengthSubject = new BehaviorSubject<number>(0);
  notLength$ = this.notLengthSubject.asObservable();

  getTasks(){
    return this.http.get<Task[]>(this.url);
  }
  getTask(id:number|any){
    return this.http.get<Task>(`${this.url}/${id}`);
  }
  getTasksByStatus(status:string|any){
    return this.http.get<Task[]>(`${this.url}/filter`,{params: {status:status}});
  }
  updateTaskStatus(taskId:number|any,status:string|any){
    return this.http.post<Task>(`${this.url}/${taskId}`,null,{params: {status:status}})
  }
  getNotifications(){
    return this.http.get<Notification[]>(`${this.url}/not`)
   }
  getUnseenNotifications(){
    return this.http.get<Notification[]>(`${this.url}/unseen`)
  } 
  setToSeen(){
    return  this.http.get(`${this.url}/setSeen`)
  } 
  getNotLenght(){
    return  this.http.get<number>(`${this.url}/notLenght`)
  }

  
  incrementNotLength() {
    this.notLengthSubject.next(this.notLengthSubject.value + 1);
  }
  
  resetNotLength() {
    this.notLengthSubject.next(0);
  }
  
  getCurrentNotLength(): number {
    return this.notLengthSubject.value;
  }

}
