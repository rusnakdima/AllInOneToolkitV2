/* sys lib */
import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

/* materials */
import { MatExpansionModule } from "@angular/material/expansion";

/* models */
import { TableData } from "@models/table-data";

@Component({
  selector: "app-table",
  standalone: true,
  imports: [CommonModule, MatExpansionModule],
  templateUrl: "./table.component.html",
})
export class TableComponent {
  constructor() {}

  @Input() dataTable: TableData = {
    thead: [],
    tbody: [],
  };

  @Input() index: number = 0;

  isString(cell: any) {
    return typeof cell === "string";
  }

  isTable(cell: any) {
    return typeof cell == "object" && cell !== null;
  }

  getColorBackground(index: number) {}
}
