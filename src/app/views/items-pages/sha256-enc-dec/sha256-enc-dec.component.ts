/* system libraries */
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Subject } from "rxjs";
import * as CryptoJS from "crypto-js";

/* materials */
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

/* components */
import { CopyFieldComponent } from "../../shared/fields/copy-field/copy-field.component";
import {
  INotify,
  WindowNotifyComponent,
} from "@views/shared/window-notify/window-notify.component";

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
    WindowNotifyComponent,
  ],
  templateUrl: "./sha256-enc-dec.component.html",
})
export class Sha256EncDecComponent {
  constructor() {}

  dataNotify: Subject<INotify> = new Subject();

  inputText: string = "";
  outputText: string = "";

  encode() {
    try {
      const encodeData = CryptoJS.SHA256(this.inputText).toString();
      this.outputText = encodeData;
    } catch (error: any) {
      console.error(error);
      this.dataNotify.next({ status: "error", text: error.toString() });
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
