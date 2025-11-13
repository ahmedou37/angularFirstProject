import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet/>',
  styleUrl: './app.css'
})
export class App {
  constructor(){
    localStorage.removeItem('token');
  }
}



//service :logic without UI, for sharing logic , used for di
//component:UI + logic blocks , contains a single part of the UI

//main.ts=entry point
//App: Root component to render first
//AppConfig : Global configuration
//providers :make the service or dependencies availalble globally in the Angular app. or local by @component

//angular.json: angular's main configurations
//package.json : like pom.xml 
//tsconfig.ts : ts compiler , ts->js
//tsconfig.app.ts:Extends base config for app code only
//tsconfig.spec.ts:Extends base config for test only

//npm (Node Package Manager)= Node’s build tool, like Maven for Java.
//npm Registry : like maven central , the npm install from it 


// as any: "Treat window as if it could have ANY property"