import { Component, ViewChild, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { products } from './products';

@Component({
  selector: 'my-app',
  template: `
      <kendo-grid [data]="gridData" 
        [height]="410" 
        [filterable]="true"
        [reorderable]="true"
        (columnReorder)="columnOrderChange($event)"
        >
        <ng-container *ngFor="let col$ of (cols | async)">
          <ng-container *ngIf="col$ | async as col">
            <kendo-grid-column [field]="col.field" width="80" [filterable]="col.filter"
            [title]=col.title>
            
              <ng-template kendoGridFilterCellTemplate let-filter let-column="column">
                  <kendo-grid-string-filter-cell 
                  [showOperators]="false"
                  [column]="column"
                  [filter]="filter">
                  </kendo-grid-string-filter-cell>
                </ng-template>
            </kendo-grid-column>
          </ng-container>
        </ng-container>
      </kendo-grid>
      <button (click)="onClick()">Click</button>
    `,
})
export class AppComponent {
  public gridData: any[] = products;
  public cols = new BehaviorSubject<
    BehaviorSubject<{ field: string; filter: boolean; title?: string }>[]
  >([
    new BehaviorSubject({ field: 'ProductID', filter: true }),
    new BehaviorSubject({ field: 'ProductName', filter: false }),
    new BehaviorSubject({ field: 'Category.CategoryName', filter: true }),
  ]);

  columnOrderChange($event) {
    const newIndex = $event.newIndex;
    const oldIndex = $event.oldIndex;

    const oldOrder = this.cols.value;
    const newOrder = [...oldOrder];
    const column = newOrder.splice(oldIndex, 1)[0];
    newOrder.splice(newIndex, 0, column);
    this.cols.next(newOrder);
  }

  onClick() {
    // const column = this.cols.value[0].value;
    // this.cols.value[0].next({ ...column, title: 'foo' });

    const columns = [...this.cols.value];
    const productID = columns.splice(0, 1)[0];
    columns.splice(1, 0, productID);
    this.cols.next(columns);
  }
}
