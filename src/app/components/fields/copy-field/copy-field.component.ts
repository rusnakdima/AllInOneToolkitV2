/* sys lib */
import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

/* materials */
import { MatIconModule } from "@angular/material/icon";

/* services */
import { NotifyService } from "@services/notify.service";

@Component({
  selector: "app-copy-field",
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: "./copy-field.component.html",
})
export class CopyFieldComponent {
  constructor(private notifyService: NotifyService) {}

  @Input() value: string | Array<string> = "";

  copyData() {
    if (typeof this.value === "string") {
      navigator.clipboard.writeText(this.value ?? "");
    } else if (Array.isArray(this.value) && this.value.length > 0) {
      navigator.clipboard.writeText(this.value.join("\n"));
    }
    this.notifyService.showSuccess("Data copied successfully!");
  }

  isArray() {
    return Array.isArray(this.value);
  }
}
