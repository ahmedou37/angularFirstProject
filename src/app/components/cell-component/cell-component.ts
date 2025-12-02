import { Component, inject, Injector } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { AdminComponent } from '../admin-component/admin-component';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../services/user-service/user-service';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { TooltipModule } from 'primeng/tooltip';
import { TaskComponent } from '../task-component/task-component';
import { UserComponent } from '../user-component/user-component';



export interface DialogOpener {
  openDialog(mode: string, id?: number,rowData?:any): void;
}


@Component({
  selector: 'app-cell-component',
  imports: [DialogModule, SelectModule, InputTextModule, FormsModule, ButtonModule, TooltipModule],
  templateUrl: './cell-component.html',
  styleUrl: './cell-component.css',
})
export class CellComponent implements ICellRendererAngularComp {
  private injector = inject(Injector);
  private userService = inject(UserService);


  type: string = '';
  rowData: any;
  parent?: DialogOpener

  agInit(params: any): void {
    this.rowData = params.rowData;
    this.type = params.type;
    this.parent=params.parent as DialogOpener;
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return false;
  }

  getImageUrl(imageName: string) {
    return this.userService.getImageUrl(imageName);
  }

}