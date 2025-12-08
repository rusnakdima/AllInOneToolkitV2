/* sys lib */
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

/* models */
import { TableData } from "@models/table-data";

/* services */
import { NotifyService } from "@services/notify.service";

/* components */
import { FileInputComponent } from "@components/fields/file-input/file-input.component";
import { TableComponent } from "@components/table/table.component";

@Component({
  selector: "app-json-to-table",
  standalone: true,
  imports: [CommonModule, FileInputComponent, TableComponent],
  templateUrl: "./json-to-table.view.html",
})
export class JsonToTableView {
  constructor(private notifyService: NotifyService) {}

  typeFile: Array<string> = ["json"];
  jsonData: { [key: string]: any } = {};

  dataTable: TableData = {
    thead: [],
    tbody: [],
  };
  blockTable: boolean = false;

  setDataFile(dataFile: any) {
    this.jsonData = JSON.parse(dataFile);
  }

  setData(event: any) {
    try {
      this.jsonData = JSON.parse(event.target.value);
    } catch (err: any) {
      console.error(err);
      this.notifyService.showError(err.toString());
    }
  }

  createTable() {
    this.blockTable = true;
    this.dataTable = this.parseObj(this.jsonData);
  }

  parseArr(arr: Array<any>): TableData {
    let table: TableData = { thead: [], tbody: [] };
    const keys: Array<any> = [];
    arr.forEach((elem: any) => {
      Object.keys(elem).forEach((key: string) => {
        if (!keys.includes(key)) {
          keys.push(key);
        }
      });
    });
    table.thead = keys;

    arr.forEach((elem: any) => {
      let tempRow: (string | TableData)[] = [];
      keys.forEach((key: string) => {
        const element = elem[key];
        if (!element && element == null) {
          tempRow.push("");
        } else if (Array.isArray(element) && typeof element[0] == "object") {
          tempRow.push(this.parseArr(element));
        } else if (!Array.isArray(element) && typeof element == "object") {
          tempRow.push(this.parseObj(element));
        } else {
          tempRow.push(element.toString());
        }
      });
      table.tbody.push(tempRow);
    });
    return table;
  }

  parseObj(obj: { [key: string]: any }): TableData {
    let table: TableData = { thead: ["Key", "Value"], tbody: [] };
    Object.entries(obj).forEach(([key, value]) => {
      let tempRow: (string | TableData)[] = [];
      tempRow.push(key);
      if (value == null) {
        tempRow.push("null");
      } else if (Array.isArray(value) && typeof value[0] == "object") {
        tempRow.push(this.parseArr(value));
      } else if (!Array.isArray(value) && typeof value == "object") {
        tempRow.push(this.parseObj(value));
      } else {
        tempRow.push(value.toString());
      }
      table.tbody.push(tempRow);
    });
    return table;
  }
}
