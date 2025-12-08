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
  selector: "app-json-to-xml",
  standalone: true,
  imports: [CommonModule, FileInputComponent],
  templateUrl: "./json-to-xml.view.html",
})
export class JsonToXmlView {
  constructor(
    private fileService: FileService,
    private notifyService: NotifyService
  ) {}

  typeFile: Array<string> = ["json"];
  fileName: string = "";
  dataJson: { [key: string]: any } = {};
  dataXml: string = "";
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

  parseData(obj: { [key: string]: any }, stroke: string = "") {
    let tempElement = "";
    Object.entries(obj).forEach(([key, value]) => {
      if (value == null) {
        key = key.replace(/[\" \"]/gi, "");
        tempElement += `<${key}>null</${key}>`;
      } else if (Array.isArray(value)) {
        tempElement += `${this.parseData(value, key)}`;
      } else if (typeof value == "object") {
        key = isNaN(+key) ? key : stroke;
        key = key.replace(/[\" \"]/gi, "");
        tempElement += `<${key}>${this.parseData(value, key)}</${key}>`;
      } else {
        key = key.replace(/[\" \"]/gi, "");
        tempElement += `<${key}>${value}</${key}>`;
      }
    });
    return tempElement;
  }

  convertData() {
    if (Object.keys(this.dataJson).length > 0) {
      this.dataXml = `<xml>${this.parseData(this.dataJson)}</xml>`;
      if (this.dataXml != "") {
        this.notifyService.showSuccess("The data has been successfully converted!");
      } else {
        this.notifyService.showError("No data was received from the file!");
      }
    } else {
      this.notifyService.showError("There is no data for conversion!");
    }
  }

  async saveData() {
    if (this.dataXml == "") {
      this.notifyService.showError("There is no data to save!");
      return;
    }

    try {
      const nameNewFile =
        this.fileName != "" ? /^(.+)\..+$/.exec(this.fileName)![1] : "json_to_xml";
      this.pathNewFile = await Common.saveData(
        this.notifyService,
        this.fileService,
        nameNewFile,
        this.dataXml,
        "xml"
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
