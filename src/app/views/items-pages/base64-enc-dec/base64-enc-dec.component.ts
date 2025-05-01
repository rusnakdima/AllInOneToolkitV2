/* sys lib */
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

/* materials */
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

/* services */
import { NotifyService } from "@services/notify.service";

/* components */
import { CopyFieldComponent } from "@shared/fields/copy-field/copy-field.component";

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
  ],
  templateUrl: "./base64-enc-dec.component.html",
})
export class Base64EncDecComponent {
  constructor(private notifyService: NotifyService) {}

  inputText: string = "";
  outputText: string = "";

  encode() {
    try {
      const encodeData = btoa(this.inputText);
      this.outputText = encodeData;
    } catch (error: any) {
      console.error(error);
      this.notifyService.showError(error.toString());
    }
  }

  decode() {
    try {
      const decodeData = atob(this.inputText);
      this.outputText = decodeData;
    } catch (error: any) {
      console.error(error);
      this.notifyService.showError(error.toString());
    }
  }
}
