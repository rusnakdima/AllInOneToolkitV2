/* sys lib */
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Subject } from "rxjs";
import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  ChartType,
  DoughnutController,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PieController,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";

/* materials */
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

/* components */
import { FileInputComponent } from "@views/shared/fields/file-input/file-input.component";
import { TableComponent } from "@views/shared/table/table.component";
import {
  INotify,
  WindowNotifyComponent,
} from "@views/shared/window-notify/window-notify.component";

Chart.register(
  BarController,
  PieController,
  LineController,
  DoughnutController,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

@Component({
  selector: "app-visual-data-on-chart",
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FileInputComponent,
    TableComponent,
    WindowNotifyComponent,
  ],
  templateUrl: "./visual-data-on-chart.component.html",
})
export class VisualDataOnChartComponent {
  constructor() {}

  dataNotify: Subject<INotify> = new Subject();

  typeFile: Array<string> = ["xls"];
  dataXls: Array<any> = [];
  dataField: string = "";
  columns: number = 0;
  rows: number = 0;

  myChart: Chart | null = null;

  myChartType: Array<string> = ["bar", "line", "pie", "doughnut"];
  dataTable: { thead: Array<any>; tbody: Array<any> } = {
    thead: [],
    tbody: [],
  };
  chartType: string = "bar";

  blockTable: boolean = false;
  blockChart: boolean = false;
  outChart: boolean = false;

  setDataFile(dataFile: any) {
    this.dataXls = JSON.parse(dataFile);
  }

  setData(event: any) {
    if (event.target.value != "") {
      this.dataXls = event.target.value
        .split("\n")
        .map((elem: string) => elem.split("\t"));
    } else {
      this.dataNotify.next({
        status: "error",
        text: "The field is empty! Insert the data!",
      });
    }
  }

  setColumns(event: any) {
    this.columns = event.target.value;
  }

  setRows(event: any) {
    this.rows = event.target.value;
  }

  setChartType(event: any) {
    this.chartType = event.target.value;
  }

  createTableManual() {
    if (this.columns > 0 && this.rows > 0) {
      let dataArr = [];
      for (let i = 0; i < this.rows; i++) {
        let tempArr = [];
        for (let j = 0; j < this.columns; j++) {
          tempArr.push("");
        }
        dataArr.push(tempArr);
      }

      this.dataXls = dataArr;
      this.createTable();
    } else {
      this.dataNotify.next({
        status: "error",
        text: "The fields are empty! Enter the data!",
      });
    }
  }

  createTable() {
    this.blockTable = true;
    this.blockChart = true;
    this.rows = this.dataXls.length;
    this.columns = this.dataXls[0].length;
    let tempHead: Array<any> = [];
    this.dataXls[0].forEach((val: any) => {
      tempHead.push(val);
    });
    let tempBody: Array<any> = [];
    this.dataXls.splice(0, 1);
    this.dataXls.forEach((row: any) => {
      let tempRow: Array<any> = [];
      row.forEach((val: any) => {
        tempRow.push(val);
      });
      tempBody.push(tempRow);
    });
    this.dataTable["thead"] = tempHead;
    this.dataTable["tbody"] = tempBody;
  }

  isValidChartType(type: string) {
    return this.myChartType.includes(type);
  }

  createChart() {
    this.outChart = true;
    setTimeout(() => {
      const ctx = document.getElementById("myChart") as HTMLCanvasElement;
      if (ctx) {
        if (this.myChart) {
          this.myChart.destroy();
          ctx.getContext("2d")!.reset();
        }

        if (!this.isValidChartType(this.chartType)) {
          this.dataNotify.next({
            status: "error",
            text: "No such chart type was found!",
          });
          return;
        }

        const data: Array<any> = this.dataTable.tbody.map((item: any) =>
          item.slice(1).map((item1: any) => item1)
        );
        const rowLab: Array<any> = this.dataTable.tbody.map(
          (item: any) => item[0]
        );
        const colLab: Array<any> = this.dataTable.thead
          .map((item: any) => item)
          .slice(1);

        this.myChart = new Chart(ctx, {
          type: this.chartType as ChartType,
          data: {
            labels: colLab,
            datasets: data.map((rowData: any, index: number) => {
              return {
                label: `${rowLab[index]}`,
                data: rowData,
                backgroundColor: `rgb(${Math.floor(
                  Math.random() * 256
                )}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
                  Math.random() * 256
                )})`,
              };
            }),
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: false,
              },
            },
          },
        });
      }
    }, 100);
  }
}
