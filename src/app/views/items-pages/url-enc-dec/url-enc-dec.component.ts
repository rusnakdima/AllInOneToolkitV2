/* sys lib */
import { CommonModule } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

/* materials */
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

/* services */
import { NotifyService } from "@services/notify.service";

/* components */
import { CopyFieldComponent } from "@shared/fields/copy-field/copy-field.component";

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
  ],
  templateUrl: "./url-enc-dec.component.html",
})
export class UrlEncDecComponent {
  constructor(private notifyService: NotifyService) {}

  inputText: string = "";
  outputText: string = "";

  encode() {
    try {
      const encodeUrl = encodeURIComponent(this.inputText);
      this.outputText = encodeUrl;
    } catch (error: any) {
      console.error(error);
      this.notifyService.showError(error.toString());
    }
  }

  decode() {
    try {
      const decodeUrl = decodeURIComponent(this.inputText);
      this.outputText = decodeUrl;
    } catch (error: any) {
      console.error(error);
      this.notifyService.showError(error.toString());
    }
  }
}
