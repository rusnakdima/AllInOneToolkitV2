/* sys lib */
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

/* components */
import { FileInputComponent } from "@components/fields/file-input/file-input.component";

@Component({
  selector: "app-csv-to-table",
  standalone: true,
  imports: [CommonModule, FileInputComponent],
  templateUrl: "./csv-to-table.view.html",
})
export class CsvToTableView {
  constructor() {}

  typeFile: Array<string> = ["csv"];
  arrCSV: Array<any> = [];

  dataTable: Array<any> = [];
  blockTable: boolean = false;

  setDataFile(dataFile: any) {
    this.arrCSV = dataFile.split("\r\n").map((line: any) => line.split(","));
  }

  setData(event: any) {
    if (event.target.value != "") {
      this.arrCSV = event.target.value.split("\n").map((line: any) => line.split(","));
    }
  }

  createTable() {
    this.blockTable = true;
    if (this.arrCSV[this.arrCSV.length - 1][0] === "") {
      this.arrCSV.pop();
    }
    this.dataTable = this.arrCSV;
  }
}
