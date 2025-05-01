/* sys lib */
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

/* components */
import { DetailsComponent } from "@shared/details/details.component";
import { FileInputComponent } from "@shared/fields/file-input/file-input.component";

interface HeadData {
  key: string;
  type: string;
  value: string;
  padLeft: number;
  open: boolean;
}

interface ItemData {
  key: string;
  type: string;
  value: string;
  padLeft: number;
}

interface DetailsData {
  head: HeadData;
  list: (
    | (HeadData & { head?: undefined })
    | (ItemData & { head?: undefined })
    | DetailsData
  )[];
}

@Component({
  selector: "app-plist-to-table",
  standalone: true,
  imports: [CommonModule, FileInputComponent, DetailsComponent],
  templateUrl: "./plist-to-table.component.html",
})
export class PlistToTableComponent {
  constructor() {}

  typeFile: Array<string> = ["plist"];
  xmlData: string = "";
  dataDetails: DetailsData = {
    head: { key: "", type: "", value: "", padLeft: 0, open: false },
    list: [],
  };

  blockList: boolean = false;

  setDataFile(dataFile: any) {
    this.xmlData = dataFile;
  }

  parseData(array: any, key: string, padLeft: number) {
    const tempDetails: DetailsData = {
      head: {
        key: key,
        type: "Dictonary",
        value: String(array.length / 2),
        padLeft: padLeft - 20,
        open: false,
      },
      list: [],
    };
    padLeft += 20;

    let tempRow: Array<
      | DetailsData
      | { key: string; type: string; value: string; padLeft: number }
    > = [];

    for (let i = 0; i <= array.length - 1; i = i + 2) {
      const element = array[i];
      const element1 = array[i + 1];
      if (element1.nodeName == "dict") {
        tempRow.push(
          this.parseData([...element1.children], element.textContent, padLeft)
        );
      } else if (element1.nodeName == "array") {
        const tempDetails1: DetailsData = {
          head: {
            key: element.textContent,
            type: "Array",
            value: String([...element1.children].length),
            padLeft: padLeft - 20,
            open: false,
          },
          list: [],
        };

        let tempRow1: (
          | { key: string; type: string; value: string; padLeft: number }
          | DetailsData
        )[] = [];

        if (element1.children[0].nodeName == "dict") {
          for (let j = 0; j < [...element1.children].length; j++) {
            tempRow1.push(
              this.parseData(
                [...element1.children][j].children,
                "" + j,
                padLeft + 20
              )
            );
          }
        } else {
          for (let j = 0; j < [...element1.children].length; j++) {
            const element2 = [...element1.children][j];
            tempRow1.push({
              key: String(j),
              type: element2.nodeName,
              value: element2.textContent,
              padLeft: padLeft + 20,
            });
          }
        }
        tempDetails1.list = tempRow1;
        tempRow.push(tempDetails1);
      } else if (element1.nodeName == "true" || element1.nodeName == "false") {
        tempRow.push({
          key: element.textContent,
          type: "Boolean",
          value: element1.nodeName,
          padLeft: padLeft,
        });
      } else {
        tempRow.push({
          key: element.textContent,
          type: element1.nodeName,
          value: element1.textContent,
          padLeft: padLeft,
        });
      }
    }
    tempDetails.list = tempRow;
    return tempDetails;
  }

  createList() {
    this.blockList = true;
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(this.xmlData, "text/xml");
    let dict = xmlDoc.children[0].children[0];
    this.dataDetails = this.parseData(Array.from(dict.children), "Root", 20);
  }
}
