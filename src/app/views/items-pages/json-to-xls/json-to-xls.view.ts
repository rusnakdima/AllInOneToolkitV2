/* sys lib */
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

/* helpers */
import { Common } from "@helpers/common";

/* services */
import { FileService } from "@services/file.service";
import { NotifyService } from "@services/notify.service";

/* components */
import { FileInputComponent } from "@components/fields/file-input/file-input.component";

@Component({
  selector: "app-json-to-xls",
  standalone: true,
  imports: [CommonModule, FileInputComponent],
  templateUrl: "./json-to-xls.view.html",
})
export class JsonToXlsView {
  constructor(
    private fileService: FileService,
    private notifyService: NotifyService
  ) {}

  typeFile: Array<string> = ["json"];
  fileName: string = "";
  dataJson: { [key: string]: any } = {};
  dataXls: Array<any> = [];
  pathNewFile: string = "";

  setDataFile(dataFile: any) {
    this.dataJson = JSON.parse(dataFile);
  }

  setFileName(event: any) {
    this.fileName = event;
  }

  setData(event: any) {
    try {
      this.dataJson = JSON.parse(event.target.value);
    } catch (err: any) {
      console.error(err);
      this.notifyService.showError(err.toString());
    }
  }

  parseArr(arr: Array<any>) {
    let table: Array<Array<string>> = [];
    let tableHead: Array<string> = [];
    let tableBody: Array<Array<string>> = [];
    arr.forEach((elem: any) => {
      Object.keys(elem).forEach((key: string) => {
        if (!tableHead.includes(key)) {
          tableHead.push(key);
        }
      });
    });
    table.push(tableHead);
    let tempTableHead = tableHead.slice();

    arr.forEach((elem: any) => {
      let tableRow: Array<Array<string>> = [];
      tableRow.push([]);
      let pos = 0;
      tableHead.forEach((key: string) => {
        const value = elem[key];
        if (value != undefined) {
          if (Array.isArray(value) && typeof value[0] == "object") {
            const tempTable: Array<Array<string>> = this.parseArr(value);
            tempTableHead.splice(pos, 1);
            tempTable[0].reverse().forEach((cell: string) => {
              if (!tempTableHead.includes(`${key}/${cell}`)) {
                tempTableHead.splice(pos, 0, `${key}/${cell}`);
              }
            });
            tempTable.map((row: Array<string>, indexArr: number) => {
              if (indexArr != 0) {
                if (tableRow[indexArr - 1] == undefined) {
                  tableRow[indexArr - 1] = [];
                }
                if (pos > tableRow[indexArr - 1].length) {
                  const lenEmpty = pos - tableRow[indexArr - 1].length;
                  tableRow[indexArr - 1].push(...Array(lenEmpty).fill(""));
                }
                tableRow[indexArr - 1].push(...row);
              }
            });
            pos += tempTable[0].length;
          } else if (!Array.isArray(value) && typeof value == "object") {
            const tempTable: Array<Array<string>> = this.parseObj(value);
            tempTableHead.splice(pos, 1);
            tempTable[0].reverse().forEach((cell: string) => {
              if (!tempTableHead.includes(`${key}/${cell}`)) {
                tempTableHead.splice(pos, 0, `${key}/${cell}`);
              }
            });
            tempTable.map((row: Array<string>, indexArr: number) => {
              if (indexArr != 0) {
                if (tableRow[indexArr - 1] == undefined) {
                  tableRow[indexArr - 1] = [];
                }
                if (pos > tableRow[indexArr - 1].length) {
                  const lenEmpty = pos - tableRow[indexArr - 1].length;
                  tableRow[indexArr - 1].push(...Array(lenEmpty).fill(""));
                }
                tableRow[indexArr - 1].push(...row);
              }
            });
            pos += tempTable[0].length;
          } else {
            pos++;
            tableRow[0].push(value.toString());
          }
        } else if (value == null) {
          pos++;
          tableRow[0].push("null");
        } else {
          pos++;
          tableRow[0].push("null");
        }
      });
      tableBody.push(...tableRow);
    });
    table[0] = tempTableHead;
    table.push(...tableBody);
    return table;
  }

  public parseObj(obj: { [key: string]: any }) {
    let table: Array<Array<string>> = [];
    let tableHead: Array<string> = [];
    let tableBody: Array<Array<string>> = [];
    tableBody.push([]);
    let pos = 0;
    Object.entries(obj).forEach(([key, value]) => {
      if (value == null) {
        pos++;
        tableHead.push(key);
        tableBody[0].push("null");
      } else if (Array.isArray(value) && typeof value[0] === "object") {
        const tempTable: Array<Array<string>> = this.parseArr(value);
        tempTable[0].forEach((cell: string) => {
          tableHead.push(`${key}/${cell}`);
        });
        tempTable.map((row: Array<string>, indexArr: number) => {
          if (indexArr != 0) {
            if (tableBody[indexArr - 1] == undefined) {
              tableBody[indexArr - 1] = [];
            }
            if (pos > tableBody[indexArr - 1].length) {
              const lenEmpty = pos - tableBody[indexArr - 1].length;
              tableBody[indexArr - 1].push(...Array(lenEmpty).fill(""));
            }
            tableBody[indexArr - 1].push(...row);
          }
        });
        pos += tempTable[0].length;
      } else if (!Array.isArray(value) && typeof value === "object") {
        const tempTable: Array<Array<string>> = this.parseObj(value);
        tempTable[0].forEach((cell: string) => {
          tableHead.push(`${key}/${cell}`);
        });
        tempTable.map((row: Array<string>, indexArr: number) => {
          if (indexArr != 0) {
            if (tableBody[indexArr - 1] == undefined) {
              tableBody[indexArr - 1] = [];
            }
            if (pos > tableBody[indexArr - 1].length) {
              const lenEmpty = pos - tableBody[indexArr - 1].length;
              tableBody[indexArr - 1].push(...Array(lenEmpty).fill(""));
            }
            tableBody[indexArr - 1].push(...row);
          }
        });
        pos += tempTable[0].length;
      } else {
        pos++;
        tableHead.push(key);
        tableBody[0].push(value.toString());
      }
    });
    table.push(tableHead);
    tableBody = tableBody.filter((row: Array<string>) => row.length > 0);
    table.push(...tableBody);
    return table;
  }

  convertData() {
    if (Object.keys(this.dataJson).length > 0) {
      this.dataXls = this.parseObj(this.dataJson);

      if (this.dataXls.length > 0) {
        this.notifyService.showSuccess("The data has been successfully converted!");
      } else {
        this.notifyService.showError("No data was received from the file!");
      }
    } else {
      this.notifyService.showError("There is no data for conversion!");
    }
  }

  async saveData() {
    if (this.dataXls.length == 0) {
      this.notifyService.showError("There is no data to save!");
      return;
    }

    try {
      const nameNewFile =
        this.fileName != "" ? /^(.+)\..+$/.exec(this.fileName)![1] : "json_to_xls";
      this.pathNewFile = await Common.saveData(
        this.notifyService,
        this.fileService,
        nameNewFile,
        this.dataXls,
        "xls"
      );
    } catch (error) {
      this.notifyService.showError("No data was received from the file!");
    }
  }

  async openFolder() {
    if (this.pathNewFile == "") {
      this.notifyService.showError("You didn't save the file!");
      return;
    }

    try {
      const pathFolder = this.pathNewFile
        .split(/[\/\\]/)
        .slice(0, -1)
        .join("/");
      Common.openFolder(this.notifyService, this.fileService, pathFolder);
    } catch (error) {
      console.error(error);
      this.notifyService.showError(
        "You didn't save the file to open the folder where it is stored!"
      );
    }
  }

  async openFile() {
    if (this.pathNewFile == "") {
      this.notifyService.showError("You didn't save the file!");
      return;
    }

    try {
      Common.openFile(this.notifyService, this.fileService, this.pathNewFile);
    } catch (error) {
      console.error(error);
      this.notifyService.showError("You didn't save the file to open it!");
    }
  }
}
