/* sys lib */
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Subject } from "rxjs";

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
  selector: "app-base64-enc-dec",
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
  templateUrl: "./base64-enc-dec.component.html",
})
export class Base64EncDecComponent {
  constructor() {}

  dataNotify: Subject<INotify> = new Subject();

  inputText: string = "";
  outputText: string = "";

  encode() {
    try {
      const encodeData = btoa(this.inputText);
      this.outputText = encodeData;
    } catch (error: any) {
      console.error(error);
      this.dataNotify.next({ status: "error", text: error.toString() });
    }
  }

  decode() {
    try {
      const decodeData = atob(this.inputText);
      this.outputText = decodeData;
    } catch (error: any) {
      console.error(error);
      this.dataNotify.next({ status: "error", text: error.toString() });
    }
  }
}
