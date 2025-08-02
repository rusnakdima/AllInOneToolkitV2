/* sys lib */
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import * as CryptoJS from "crypto-js";

/* materials */
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

/* services */
import { NotifyService } from "@services/notify.service";

/* components */
import { CopyFieldComponent } from "@components/fields/copy-field/copy-field.component";

@Component({
  selector: "app-sha256-enc-dec",
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    CopyFieldComponent,
  ],
  templateUrl: "./sha256-enc-dec.component.html",
})
export class Sha256EncDecComponent {
  constructor(private notifyService: NotifyService) {}

  inputText: string = "";
  outputText: string = "";

  encode() {
    try {
      const encodeData = CryptoJS.SHA256(this.inputText).toString();
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
