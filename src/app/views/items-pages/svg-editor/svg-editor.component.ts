/* sys lib */
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

/* components */
import { FileInputComponent } from "../../shared/fields/file-input/file-input.component";

@Component({
  selector: "app-svg-editor",
  standalone: true,
  imports: [CommonModule, FileInputComponent],
  templateUrl: "./svg-editor.component.html",
})
export class SvgEditorComponent {
  constructor(private sanitizer: DomSanitizer) {}

  typeFile: string = "svg";
  svgData: string = "";
  dataField: string = "";

  svgPrevData: SafeHtml | null = null;

  setDataFile(dataFile: any) {
    this.svgData = dataFile;
  }

  parseFile() {
    this.dataField = this.svgData;
    this.convertData();
  }

  parseField(event: any) {
    this.dataField = event.target.value;
    this.convertData();
  }

  convertData() {
    this.svgPrevData = this.sanitizer.bypassSecurityTrustHtml(this.dataField);
  }
}
