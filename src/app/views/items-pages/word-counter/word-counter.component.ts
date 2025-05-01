/* sys lib */
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

/* components */
import { FileInputComponent } from "@shared/fields/file-input/file-input.component";

@Component({
  selector: "app-word-counter",
  standalone: true,
  imports: [CommonModule, FileInputComponent],
  templateUrl: "./word-counter.component.html",
})
export class WordCounterComponent {
  constructor() {}

  typeFile: Array<string> = ["txt"];

  inputText: string = "";
  outputText: string = "";

  setDataFile(dataFile: any) {
    this.inputText = dataFile;
  }

  setData(event: any) {
    this.inputText = event.target.value;
  }

  calculate() {
    let text = this.inputText;
    let num_chars = text.split("").length;
    let num_words = text.split(" ").length;

    this.outputText = `${num_chars} characters, ${num_words} words`;
  }
}
