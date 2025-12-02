import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, count, Observable, tap } from 'rxjs';
import { User } from '../../model/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url='http://localhost:8080/users';
  http=inject(HttpClient);

  getUsers(){
    return this.http.get<User[]>(this.url);
  }
  getUserById(id:number|null){
    return this.http.get<User>(`${this.url}/${id}`)
  }
  getUserByName(name:string|null){
    return this.http.get<User>(`${this.url}/name/${name}`)
  }
  createUser(user:User){
    return this.http.post<User>(this.url,user)
  }
  updateUser(user:User){
    return this.http.put<User>(this.url,user)
  }
  deleteUser(id:number|any){
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' })
  }


  addImage(image: File): Observable<string> {
    console.log("imageName"+image.name)
    const formData = new FormData();
    formData.append('image', image); // 'image' must match @RequestParam("image")
  
    return this.http.post(`${this.url}/images`, formData, {
      responseType: 'text'
    });
  }
 
  getImageUrl(imageName: string|undefined): string {
    return `http://localhost:8080/images/${imageName}`;
  }

  getImage(imageName: string|undefined){
    return this.http.get(`http://localhost:8080/images/${imageName}`, {
    responseType: 'blob'  // tells Angular it's a file, not JSON
  });
  }
}
