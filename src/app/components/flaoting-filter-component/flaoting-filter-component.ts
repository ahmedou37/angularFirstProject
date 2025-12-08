import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IFloatingFilterAngularComp } from 'ag-grid-angular';
import {
  IFloatingFilterParams,
  IDoesFilterPassParams,
  AgPromise
} from 'ag-grid-community';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-custom-floating-filter',
  imports:[InputTextModule,ButtonModule,FormsModule],
  templateUrl: `./flaoting-filter-component.html`,
  styleUrl: `./flaoting-filter-component.css`
})
export class FloatingFilterComponent implements IFloatingFilterAngularComp {
  
  placeholder:string=''
  params!: any;
  currentValue: string = '';
  filterType: 'text' | 'number' | 'date' = 'text';

  agInit(params:any): void {
    this.params = params;

    this.filterType = params.filterParams?.type || 'text';
    this.placeholder=params.filterParams?.placeholder
  console.log("type: ", this.filterType);
  }

  /**
   * Called when parent filter changes programmatically.
   */
  onParentModelChanged(parentModel: any): void {
    if (!parentModel) {
      return;
    } 
      this.currentValue = parentModel.filter||'';
    
  }

  /** When user types in floating filter input */
  onInputChange(event: any) {
    this.currentValue = event.target.value;
     console.log("called ddd")
    // Tell the parent filter instance to update
    this.params.parentFilterInstance((instance: any) => {
      instance.onFloatingFilterChanged({
        type: this.filterType,
        value: this.currentValue
      });
    });
  }
}
