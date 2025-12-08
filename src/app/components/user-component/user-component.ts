import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user-service/user-service';
import { User } from '../../model/User';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MenuComponent } from '../menu-component/menu-component';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, themeQuartz } from 'ag-grid-community';
import { CellComponent, DialogOpener } from '../cell-component/cell-component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-user-component',
  imports: [MatCardModule, MatIconModule,MatButtonModule,
    CommonModule,MatMenuModule,MatInputModule,FormsModule,MatSelectModule
    ,MatOptionModule,AgGridAngular,DialogModule,ButtonModule,TooltipModule
    ,InputTextModule,MenuComponent,SelectModule],
  templateUrl: './user-component.html',
  styleUrl: './user-component.css'
})
export class UserComponent implements DialogOpener{
  userService=inject(UserService)

  users:User[]=[]
  searchedUser:User={
    name:'',
    password:'',
    email:''
  }
  searchedId:number|null=null

  updatedUser:User={
    name:'',
    password:'',
    email:''
  }

  displayUsers:boolean=false
  displayUser:boolean=false

  buttonDisplay:boolean=false

  numbers = new Array(100).fill(0).map((_, i) => i + 1);


  theme=themeQuartz
  
    colDefault:ColDef={
      flex:1,
      filter:true,
      floatingFilter:true,
      cellStyle: {'border-right-color': '#e2e2e2','display':'flex'}
    }
    colDef: ColDef[] = [
      { field:'id' ,
        flex:0.6
      },
      { field:'picture',
        flex:0.6,
        cellStyle:{'margin':'3px'},
        cellRenderer:CellComponent,
        cellRendererParams:(p:any)=>({
          type:'picture',
          rowData:p.data,
          parent:this
        })
      },
      { field: 'name' },
      { field:'email'},  
      { field: 'role',
        cellRenderer:CellComponent,
        cellRendererParams:(p:any)=>({
          type:'edite-user',
          rowData:p.data,
          parent:this
        }),
        suppressSizeToFit: true,
        autoHeight: true
      }
    ];
    pageSize=7
    pageSizeSelector=[7,10,15]


  constructor(){
    this.getUsers()
  }

  getUsers(){
    this.userService.getUsers().subscribe(data=>{
      this.users=data,
      this.displayUsers=true,
      this.displayUser=false,
      this.searchedId=null
    })
  }

  getUser(){
    this.userService.getUserById(this.searchedId).subscribe(data=>{
      this.searchedUser=data,
      this.displayUser=true,
      this.displayUsers=false
    })
  }

  updateUser(){
    if(this.image){
      this.userService.addImage(this.image).subscribe({
      next: (data) => {
        this.updatedUser.imageName=data,
        console.log("Image added successfully:",this.updatedUser.imageName);
    },
    });
    }
    this.userService.updateUser(this.updatedUser).subscribe(data=>{
      this.getUsers(),
      this.image=null,
      this.editeDialog=false
    })
  }

  deletedId=0
  deleteUser(){
    this.deletedId=Number(this.deletedId)
    this.userService.deleteUser(this.deletedId).subscribe(data=>{
      this.deleteDialog=false
      this.getUsers()
    })
  }


  getImageUrl(imageName:string){
    return this.userService.getImageUrl(imageName)
  }


  idChange(selectedValue: number) {
   if (selectedValue == 0) {
      this.getUsers();
    } else {
     this.getUser();
    }
  }  
  

  image?:File|null
  onImageSelected(event: any,user:User) {
  const file: File = event.target.files[0];
  if (file) {
    this.image = file;
    user.imageName=file.name
  }
  }




  openDialog(type:string,id:number,rowData:any){
    if(type=="edite"){
      this.updatedUser = { ...rowData };
      this.updatedUser.id=id
      this.editeDialog=true
    }
    else if(type=="delete"){
      this.deletedId=id
      this.deleteDialog=true
    }
  }

  editeDialog=false
  deleteDialog=false
  
}
