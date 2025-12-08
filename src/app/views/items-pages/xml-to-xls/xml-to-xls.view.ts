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

/* views */
import { XmlToJsonView } from "../xml-to-json/xml-to-json.view";
import { JsonToXlsView } from "../json-to-xls/json-to-xls.view";

@Component({
  selector: "app-xml-to-xls",
  standalone: true,
  imports: [CommonModule, FileInputComponent],
  templateUrl: "./xml-to-xls.view.html",
})
export class XmlToXlsView {
  constructor(
    private fileService: FileService,
    private notifyService: NotifyService
  ) {}

  typeFile: Array<string> = ["xml"];
  fileName: string = "";
  dataXml: string = "";
  dataXls: Array<any> = [];
  pathNewFile: string = "";

  setDataFile(dataFile: any) {
    this.dataXml = dataFile;
  }

  setFileName(event: any) {
    this.fileName = event;
  }

  setData(event: any) {
    try {
      this.dataXml = event.target.value;
    } catch (err: any) {
      console.error(err);
      this.notifyService.showError(err.toString());
    }
  }

  convertData() {
    if (this.dataXml != "") {
      let parser = new DOMParser();
      let xmlDoc = parser.parseFromString(this.dataXml, "text/xml");
      const dataJson = XmlToJsonView.prototype.parseData(Array.from(xmlDoc.children[0].children));
      this.dataXls = JsonToXlsView.prototype.parseObj(dataJson);

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
      const nameNewFile = this.fileName != "" ? /^(.+)\..+$/.exec(this.fileName)![1] : "xml_to_xls";
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
