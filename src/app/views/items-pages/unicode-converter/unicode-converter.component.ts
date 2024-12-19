/* sys lib */
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Subject } from "rxjs";

/* materials */
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

/* models */
import { Response } from "@models/response";

/* services */
import { UnicodeConverterService } from "@services/unicode-converter.service";

/* components */
import {
  INotify,
  WindowNotifyComponent,
} from "@views/shared/window-notify/window-notify.component";

@Component({
  selector: "app-unicode-converter",
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    WindowNotifyComponent,
  ],
  templateUrl: "./unicode-converter.component.html",
})
export class UnicodeConverterComponent {
  constructor(private unicodeConverterService: UnicodeConverterService) {}

  dataNotify: Subject<INotify> = new Subject();

  typeCoding: string = "symbol";

  inputText: string = "";

  listResult: Array<{ symbol: string; dec: string; hex: string }> = [];

  setTypeCoding(type: string) {
    this.typeCoding = type;
  }

  setData(event: any) {
    this.inputText = event.target.value;
  }

  convertData() {
    this.listResult = [];
    if (this.inputText != "") {
      this.inputText.split("").map((symbol: string) => {
        this.unicodeConverterService
          .getInfoSymbol(this.typeCoding, symbol)
          .then((data: Response) => {
            if (data.status === "success") {
              this.listResult.push({
                symbol: data.data.symbol,
                dec: data.data.dec,
                hex: data.data.hex,
              });
            } else {
              this.dataNotify.next({
                status: "error",
                text: data.message,
              });
            }
          })
          .catch((err) => {
            console.error(err);
            this.dataNotify.next({
              status: "error",
              text: err,
            });
          });
      });
    }
  }
}
