/* sys lib */
import { CommonModule } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
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
  selector: "app-url-enc-dec",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    CopyFieldComponent,
    WindowNotifyComponent,
  ],
  templateUrl: "./url-enc-dec.component.html",
})
export class UrlEncDecComponent {
  constructor() {}

  dataNotify: Subject<INotify> = new Subject();

  inputText: string = "";
  outputText: string = "";

  encode() {
    try {
      const encodeUrl = encodeURIComponent(this.inputText);
      this.outputText = encodeUrl;
    } catch (error: any) {
      console.error(error);
      this.dataNotify.next({ status: "error", text: error.toString() });
    }
  }

  decode() {
    try {
      const decodeUrl = decodeURIComponent(this.inputText);
      this.outputText = decodeUrl;
    } catch (error: any) {
      console.error(error);
      this.dataNotify.next({ status: "error", text: error.toString() });
    }
  }
}
