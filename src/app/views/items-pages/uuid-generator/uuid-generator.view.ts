/* sys lib */
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { v1, v4, v6, v7 } from "uuid";

/* materials */
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";

/* components */
import { CopyFieldComponent } from "@components/fields/copy-field/copy-field.component";

@Component({
  selector: "app-uuid-generator",
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule, CopyFieldComponent],
  templateUrl: "./uuid-generator.view.html",
})
export class UuidGeneratorView {
  constructor() {}

  listUuidGen: Array<string> = [];

  versionUuidGen: string = "v4";
  countUuidGen: number = 1;

  setVersion(version: string) {
    this.versionUuidGen = version;
  }

  setCount(event: any) {
    this.countUuidGen = Number(event.target.value);
  }

  generateUuids() {
    this.listUuidGen = [];
    for (let i = 0; i < this.countUuidGen; i++) {
      const uuid = this.generateUuid();
      this.listUuidGen.push(uuid);
    }
  }

  generateUuid(): string {
    switch (this.versionUuidGen) {
      case "v1":
        return v1();
      case "v4":
        return v4();
      case "v6":
        return v6();
      case "v7":
        return v7();
      default:
        return v4();
    }
  }
}
