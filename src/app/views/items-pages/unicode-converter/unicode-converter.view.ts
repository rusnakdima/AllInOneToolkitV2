/* sys lib */
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

/* materials */
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

/* models */
import { Response, ResponseStatus } from "@models/response";

/* services */
import { UnicodeConverterService } from "@services/unicode-converter.service";
import { NotifyService } from "@services/notify.service";

@Component({
  selector: "app-unicode-converter",
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule],
  templateUrl: "./unicode-converter.view.html",
})
export class UnicodeConverterView {
  constructor(
    private unicodeConverterService: UnicodeConverterService,
    private notifyService: NotifyService
  ) {}

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
      this.inputText
        .replaceAll(/;\s*/gi, ";")
        .split(";")
        .map((symbol: string) => {
          this.unicodeConverterService
            .getInfoSymbol<{ symbol: string; dec: string; hex: string }>(this.typeCoding, symbol)
            .then((response: Response<{ symbol: string; dec: string; hex: string }>) => {
              if (response.status == ResponseStatus.SUCCESS) {
                this.listResult.push({
                  symbol: response.data.symbol,
                  dec: response.data.dec,
                  hex: response.data.hex,
                });
              } else {
                this.notifyService.showError(response.message);
              }
            })
            .catch((err: Response<string>) => {
              this.notifyService.showError(err.message ?? err.toString());
            });
        });
    }
  }
}
