/* sys lib */
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

/* models */
import { Response, ResponseStatus } from "@models/response";

/* services */
import { FileService } from "@services/file.service";
import { NotifyService } from "@services/notify.service";

/* components */
import { FileInputComponent } from "@components/fields/file-input/file-input.component";

@Component({
  selector: "app-xml-to-json",
  standalone: true,
  imports: [CommonModule, FileInputComponent],
  templateUrl: "./xml-to-json.component.html",
})
export class XmlToJsonComponent {
  constructor(
    private fileService: FileService,
    private notifyService: NotifyService
  ) {}

  typeFile: Array<string> = ["xml"];
  fileName: string = "";
  dataXml: string = "";
  dataJson: { [key: string]: any } | null = null;
  pathNewFile: string = "";

  setDataFile(dataFile: any) {
    this.dataXml = dataFile;
  }

  setFileName(event: any) {
    this.fileName = event;
  }

  setData(event: any) {
    this.dataXml = event.target.value;
  }

  public parseData(xmlNodes: Array<any>) {
    let tempObj: { [key: string]: any } = {};
    xmlNodes.forEach((elem: any) => {
      if ([...elem.children].length > 0) {
        let rez = this.parseData([...elem.children]);
        if (tempObj[elem.nodeName] != undefined) {
          tempObj[elem.nodeName].length == undefined
            ? (tempObj[elem.nodeName] = [tempObj[elem.nodeName], rez])
            : tempObj[elem.nodeName].push(rez);
        } else tempObj[elem.nodeName] = rez;
      } else tempObj[elem.nodeName] = elem.textContent;
    });
    return tempObj;
  }

  convertData() {
    if (this.dataXml != "") {
      let parser = new DOMParser();
      let xmlDoc = parser.parseFromString(this.dataXml, "text/xml");
      this.dataJson = this.parseData(Array.from(xmlDoc.children[0].children));

      if (this.dataJson && Object.keys(this.dataJson).length > 0) {
        this.notifyService.showSuccess("The data has been successfully converted!");
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
        this.fileName != "" ? /^(.+)\..+$/.exec(this.fileName)![1] : "xml_to_json";
      await this.fileService
        .writeDataToFile(nameNewFile, JSON.stringify(this.dataJson), "json")
        .then((data: Response) => {
          if (data.status == ResponseStatus.SUCCESS) {
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
          this.notifyService.showError(`An error occurred while saving the data to a file: ${err}`);
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
          if (data.status == ResponseStatus.SUCCESS) {
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
