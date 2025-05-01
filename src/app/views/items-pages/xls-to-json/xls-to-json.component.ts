/* sys lib */
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

/* models */
import { Response } from "@models/response";

/* services */
import { FileService } from "@services/file.service";
import { NotifyService } from "@services/notify.service";

/* components */
import { FileInputComponent } from "@shared/fields/file-input/file-input.component";

@Component({
  selector: "app-xls-to-json",
  standalone: true,
  imports: [CommonModule, FileInputComponent],
  templateUrl: "./xls-to-json.component.html",
})
export class XlsToJsonComponent {
  constructor(
    private fileService: FileService,
    private notifyService: NotifyService
  ) {}

  typeFile: Array<string> = ["xls"];
  fileName: string = "";
  dataXls: Array<any> = [];
  dataJson: { [key: string]: any } | null = null;
  pathNewFile: string = "";

  setDataFile(dataFile: any) {
    this.dataXls = JSON.parse(dataFile);
  }

  setFileName(event: any) {
    this.fileName = event;
  }

  setData(event: any) {
    if (event.target.value != "") {
      this.dataXls = event.target.value
        .split("\n")
        .map((elem: string) => elem.split("\t"));
    } else {
      this.notifyService.showError("The field is empty! Insert the data!");
    }
  }

  parseData(dataArr: Array<any>) {
    this.dataJson = { root: { array: [] } };
    let strokeF = dataArr[0];
    dataArr.splice(0, 1);
    dataArr.forEach((row: any) => {
      let tempObj: { [key: string]: any } = {};
      row.forEach((cell: any, index: number) => {
        const key: string = strokeF[index]
          ? strokeF[index].replace(/[\" \"]/gi, "")
          : `column${index}`;
        tempObj[key] = cell;
      });
      this.dataJson!["root"]["array"].push(tempObj);
    });
  }

  convertData() {
    if (this.dataXls.length > 0) {
      this.parseData(this.dataXls);

      if (this.dataJson && Object.keys(this.dataJson).length > 0) {
        this.notifyService.showSuccess(
          "The data has been successfully converted!"
        );
      } else {
        this.notifyService.showError("No data was received from the file!");
      }
    } else {
      this.notifyService.showError("There is no data for conversion!");
    }
  }

  async saveData() {
    if (this.dataJson) {
      const nameNewFile =
        this.fileName != ""
          ? /^(.+)\..+$/.exec(this.fileName)![1]
          : "xls_to_json";
      await this.fileService
        .writeDataToFile(nameNewFile, JSON.stringify(this.dataJson), "json")
        .then((data: Response) => {
          if (data.status == "success") {
            this.pathNewFile = data.data;
            this.notifyService.showSuccess(
              `The data has been successfully saved to a file "${this.pathNewFile}"!`
            );
          } else {
            this.notifyService.showNotify(data.status, data.message);
          }
        })
        .catch((err) => {
          console.error(err);
          this.notifyService.showError(
            `An error occurred while saving the data to a file: ${err}`
          );
        });
    } else if (this.dataJson == null) {
      this.notifyService.showError("No data was received from the file!");
    }
  }

  async openFile() {
    if (this.pathNewFile != "") {
      await this.fileService
        .openFileInApp(this.pathNewFile)
        .then((data: Response) => {
          if (data.status == "success") {
            this.notifyService.showWarning(
              "Wait a bit until the program starts to read this file format!"
            );
          } else {
            this.notifyService.showNotify(data.status, data.message);
          }
        })
        .catch((err: any) => {
          console.error(err);
          this.notifyService.showError(err);
        });
    } else {
      this.notifyService.showError("You didn't save the file to open it!");
    }
  }
}
