/* sys lib */
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

interface TableData {
  thead: string[];
  tbody: (string | TableData)[][];
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html'
})
export class TableComponent {
  constructor() {}

  @Input() dataTable: TableData | any = {thead: [], tbody: []};

  isString(cell: any) {
    return typeof cell === 'string';
  }

  isTable(cell: any) {
    return typeof cell == 'object' && cell !== null;
  }
}
