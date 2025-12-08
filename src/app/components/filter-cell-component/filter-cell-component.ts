import { Component } from '@angular/core';
import { IFilterAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-custom-filter',
  template: `
    <div style="padding:10px">
      <input type="text" (input)="onInput($event)" [value]="filterValue"/>
    </div>
  `,
})
export class FilterCellComponent implements IFilterAngularComp {

  filterValue: string = '';
  filterType: 'text' | 'number' | 'date' = 'text';
  params: any;

  agInit(params: any): void {
    this.params = params;
    this.filterType = params.type || 'text';
  }

  // Called by floating filter
  onFloatingFilterChanged(model: { type: string, value: any }) {
    this.filterValue = model.value;
    this.params.filterChangedCallback();
  }

  onInput(event: any) {
    this.filterValue = event.target.value;
    this.params.filterChangedCallback();
  }

  isFilterActive(): boolean {
    return this.filterValue != null && this.filterValue !== '';
  }

  doesFilterPass(params: any): boolean {
    const value = params.data[this.params.colDef.field];

    if (!this.isFilterActive()) return true;

    switch (this.filterType) {
      case 'number':
        return Number(value) === Number(this.filterValue);

      case 'date':
        return new Date(value).toDateString() === new Date(this.filterValue).toDateString();

      default: // text
        return value?.toString().toLowerCase()
                     .includes(this.filterValue.toLowerCase());
    }
  }

  //returns model to grid , grid send that model to onParentModelChanged(model) 
  getModel() {
    return this.isFilterActive()
      ? { type: this.filterType, value: this.filterValue }
      : null;
  }

  setModel(model: any) {
    this.filterValue = model?.filter || '';
  }
}
