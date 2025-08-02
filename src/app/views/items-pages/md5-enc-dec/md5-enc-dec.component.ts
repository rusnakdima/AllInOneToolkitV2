/* sys lib */
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Md5 } from "ts-md5";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

/* materials */
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

/* services */
import { NotifyService } from "@services/notify.service";

/* components */
import { CopyFieldComponent } from "@components/fields/copy-field/copy-field.component";

@Component({
  selector: "app-md5-enc-dec",
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    CopyFieldComponent,
  ],
  templateUrl: "./md5-enc-dec.component.html",
})
export class Md5EncDecComponent {
  constructor(private notifyService: NotifyService) {}

  inputText: string = "";
  outputText: string = "";

  encode() {
    try {
      const encodeData = Md5.hashStr(this.inputText);
      this.outputText = encodeData;
    } catch (error: any) {
      console.error(error);
      this.notifyService.showError(error.toString());
    }
  }

  // decode() {
  //   try {
  //     const decodeData = (this.inputText);
  //     this.outputText = decodeData;
  //   } catch (error: any) {
  //     console.error(error);
  //     this.dataNotify.next({ status: 'error', text: error.toString() });
  //   }
  // }
}
