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
  selector: "app-xml-to-table",
  standalone: true,
  imports: [CommonModule, FileInputComponent, TableComponent],
  templateUrl: "./xml-to-table.component.html",
})
export class XmlToTableComponent {
  constructor(private notifyService: NotifyService) {}

  typeFile: Array<string> = ["xml"];
  xmlData: string = "";

  dataTable: TableData = {
    thead: [],
    tbody: [],
  };
  blockTable: boolean = false;

  setDataFile(dataFile: any) {
    this.xmlData = dataFile;
  }

  setData(event: any) {
    try {
      this.xmlData = event.target.value;
    } catch (err: any) {
      console.error(err);
      this.notifyService.showError(err.toString());
    }
  }

  createTable() {
    this.blockTable = true;
    let parser = new DOMParser();
    let xmlDoc: Document = parser.parseFromString(this.xmlData, "text/xml");
    let xmlCol: HTMLCollection = xmlDoc.children;
    this.dataTable = this.parseData(Array.from(xmlCol));
  }

  parseArr(arr: Array<any>) {
    let table: TableData = { thead: [], tbody: [] };
    const keys: Array<any> = [];
    arr.forEach((elem: any) => {
      [...elem.children].forEach((key: any) => {
        if (!keys.includes(key.nodeName)) {
          keys.push(key.nodeName);
        }
      });
    });
    table.thead = keys;

    arr.forEach((elem: any) => {
      let tempRow: (string | TableData)[] = [];
      keys.forEach((key: any) => {
        const element = [...elem.children].find((child) => child.nodeName == key);
        if (!element && element == null) {
          tempRow.push("");
        } else if ([...element.children].length > 0) {
          if (
            [...element.children].every(
              (value: any) => value.nodeName == element.children[0].nodeName
            )
          ) {
            tempRow.push(this.parseArr([...element.children]));
          } else {
            tempRow.push(this.parseData([...element.children]));
          }
        } else {
          tempRow.push(element.textContent.toString());
        }
      });
      table.tbody.push(tempRow);
    });
    return table;
  }

  parseData(xmlNodes: Array<any>) {
    let table: TableData = { thead: ["Key", "Value"], tbody: [] };
    xmlNodes.forEach((elem: any) => {
      let tempRow: (string | TableData)[] = [];
      tempRow.push(elem.nodeName);
      if ([...elem.children].length > 0) {
        if ([...elem.children].every((value: any) => value.nodeName == elem.children[0].nodeName)) {
          tempRow.push(this.parseArr([...elem.children]));
        } else {
          tempRow.push(this.parseData([...elem.children]));
        }
      } else {
        tempRow.push(elem.textContent.toString());
      }
      table.tbody.push(tempRow);
    });
    return table;
  }
}
