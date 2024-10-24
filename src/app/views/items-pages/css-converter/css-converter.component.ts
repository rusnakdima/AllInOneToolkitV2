/* system libraries */
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { Subject } from "rxjs";

/* materials */
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

/* services */
import { FileService } from "@services/file.service";

/* components */
import {
  INotify,
  WindowNotifyComponent,
} from "@views/shared/window-notify/window-notify.component";
import { TableComponent } from "../../shared/table/table.component";

interface TableData {
  thead: Array<any>;
  tbody: Array<any>;
}

@Component({
  selector: "app-css-converter",
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    WindowNotifyComponent,
    TableComponent
],
  templateUrl: "./css-converter.component.html",
})
export class CssConverterComponent {
  constructor(private fileService: FileService) {}

  dataNotify: Subject<INotify> = new Subject();

  typeStyle: string = "";
  dataField: string = "";
  dataArr: Array<any> = [];

  dataTable: TableData = { thead: [], tbody: [] };
  blockTable: boolean = false;

  ngOnInit(): void {
    this.getDataFile();
  }

  async getDataFile() {
    this.fileService.getCssLibrary().subscribe({
      next: (data: any) => {
        if (data) {
          this.dataArr = data["root"];
        }
      },
      error: (err: any) => {
        console.error(err);
        this.dataNotify.next({
          status: "error",
          text: "Error reading CSS library file",
        });
      },
    });
  }

  setTypeStyle(type: string) {
    this.typeStyle = type;
  }

  setData(event: any) {
    this.dataField = event.target.value;
  }

  searchElemData(item: string, style: string) {
    let textElem = "";
    try {
      let tempObj: { [key: string]: any } = {
        color: "text",
        "background-color": "bg",
        "border-color": "border",
        "border-top-color": "border-t",
        "border-bottom-color": "border-b",
        "border-left-color": "border-l",
        "border-right-color": "border-r",
        "border-inline-start-color": "border-s",
        "border-inline-end-color": "border-e",
      };
      let regCSS = /([\w\-]*):\s*([\s\w\d\%\,\(\)\#\-]*);/;
      let propCSS = regCSS.exec(item);
      if (propCSS && propCSS![2].indexOf("rgb") >= 0) {
        for (let i = 0; i < 3; i++) {
          propCSS[2] = propCSS![2].replace(/\,\s*/, " ");
          item = item.replace(/\,\s*/, " ");
        }
      }
      let propTailwind =
        /^(\w+)(?:-([\w\/\[\]]+))?(?:-([\w\/\[\]]+))?(?:-([\w\/\[\]]+))?$/.exec(
          item
        );
      if (propTailwind && propTailwind![3] && propTailwind![4]) {
        if (
          Object.values(tempObj).includes(
            propTailwind![1] + "-" + propTailwind![2]
          )
        ) {
          propTailwind![1] = propTailwind![1] + "-" + propTailwind![2];
          propTailwind![2] = propTailwind![3] + "-" + propTailwind![4];
          propTailwind![3] = "";
          propTailwind![4] = "";
        } else {
          propTailwind![2] =
            propTailwind![2] + "-" + propTailwind![3] + "-" + propTailwind![4];
          propTailwind![3] = "";
          propTailwind![4] = "";
        }
      } else if (propTailwind && propTailwind![3]) {
        if (
          Object.values(tempObj).includes(
            propTailwind![1] + "-" + propTailwind![2]
          )
        ) {
          propTailwind![1] = propTailwind![1] + "-" + propTailwind![2];
          propTailwind![2] = propTailwind![3];
          propTailwind![3] = "";
        } else {
          propTailwind![2] = propTailwind![2] + "-" + propTailwind![3];
          propTailwind![3] = "";
        }
      }
      let objItem;
      if (this.typeStyle == style) {
        textElem = item;
      } else if (
        (objItem = this.dataArr.find((obj: any) => obj[this.typeStyle] == item))
      ) {
        if (propCSS && Object.keys(tempObj).includes(propCSS![1])) {
          textElem = objItem[style]
            ? `${tempObj[String(propCSS![1])]}-${objItem[style]}`
            : "";
        } else {
          textElem = objItem[style] ? objItem[style] : "";
        }
      } else if (
        (propCSS && Object.keys(tempObj).includes(propCSS![1])) ||
        (propTailwind && Object.values(tempObj).includes(propTailwind![1]))
      ) {
        if (
          this.typeStyle == "css" &&
          (objItem = this.dataArr.find(
            (obj: any) => obj["css"] == `color: ${propCSS![2]};`
          ))
        ) {
          if (objItem) {
            textElem = objItem[style]
              ? `${tempObj[String(propCSS![1])]}-${objItem[style]}`
              : "";
          } else {
            textElem = "";
          }
        } else if (
          this.typeStyle != "css" &&
          style == "css" &&
          (objItem = this.dataArr.find(
            (obj: any) => obj[this.typeStyle] == propTailwind![2]
          ))
        ) {
          if (objItem) {
            textElem = objItem[style]
              ? `${Object.keys(tempObj).find(
                  (elem: string) => tempObj[elem] == propTailwind![1]
                )}: ${regCSS.exec(objItem["css"])![2]};`
              : "";
          } else {
            textElem = "";
          }
        } else if (
          this.typeStyle != "css" &&
          style != "css" &&
          (objItem = this.dataArr.find(
            (obj: any) => obj[this.typeStyle] == propTailwind![2]
          ))
        ) {
          if (objItem) {
            textElem = objItem[style]
              ? `${propTailwind![1]}-${objItem[style]}`
              : "";
          } else {
            textElem = "";
          }
        } else if (this.typeStyle == "css" && style == "tailwind" && propCSS) {
          let key = this.dataArr.find((obj: any) =>
            obj[style].indexOf(propCSS![1])
          )!["tailwind_custom"];
          if (Object.keys(tempObj).includes(propCSS![1])) {
            key = tempObj[propCSS![1]];
          }
          textElem = key + "-[" + propCSS![2] + "]";
        }
      } else if (this.typeStyle == "css" && style == "tailwind" && propCSS) {
        let key = this.dataArr.find((obj: any) =>
          obj[style].indexOf(propCSS![1])
        )!["tailwind_custom"];
        if (Object.keys(tempObj).includes(propCSS![1])) {
          key = tempObj[propCSS![1]];
        }
        textElem = key + "-[" + propCSS![2] + "]";
      }
    } catch (err: any) {
      this.dataNotify.next({ status: "error", text: err });
      console.error(err);
    }
    return textElem;
  }

  async convertData() {
    if (
      this.dataArr.length > 0 &&
      this.dataField != "" &&
      this.typeStyle != ""
    ) {
      this.blockTable = true;

      let listField =
        this.typeStyle != "css"
          ? this.dataField.match(/[\w\d\/\[\]\-]*[^\s*\n*]/gm)
          : this.dataField.match(/[\w\-]*:\s*[\s\w\d\%\,\(\)\#\-]*;/gm);

      let tempHead: Array<any> = [];
      if (listField) {
        listField.unshift("Data Field");
        listField.forEach((item: string) => {
          tempHead.push(item);
        });
        listField.shift();
      }

      let objStyles = {
        css: "CSS",
        bootstrap: "Bootstrap 5",
        tailwind: "Tailwind CSS",
      };

      let tempBody: Array<any> = [];
      Object.entries(objStyles).forEach(([key, value]) => {
        let tempRow: Array<any> = [];
        tempRow.push(value);
        if (listField) {
          listField.forEach((item: string) => {
            tempRow.push(this.searchElemData(item, key));
          });
        }
        tempBody.push(tempRow);
      });

      setTimeout(() => {
        this.dataTable = {
          thead: tempHead,
          tbody: tempBody,
        };
      }, 500);
    } else if (this.dataArr.length == 0) {
      this.dataNotify.next({
        status: "error",
        text: "You don't have a style library! Download it from the git repository from this program!",
      });
    } else if (this.typeStyle == "") {
      this.dataNotify.next({
        status: "error",
        text: "You have not selected the type of source styles!",
      });
    } else if (this.dataField == "") {
      this.dataNotify.next({
        status: "error",
        text: "The field is empty! Insert the data!",
      });
    }
  }
}
