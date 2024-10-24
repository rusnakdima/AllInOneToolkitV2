/* system libraries */
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Subject } from "rxjs";

/* components */
import { FileInputComponent } from "@views/shared/fields/file-input/file-input.component";
import {
  INotify,
  WindowNotifyComponent,
} from "@views/shared/window-notify/window-notify.component";

@Component({
  selector: "app-word-counter",
  standalone: true,
  imports: [CommonModule, FileInputComponent, WindowNotifyComponent],
  templateUrl: "./word-counter.component.html",
})
export class WordCounterComponent {
  constructor() {}

  dataNotify: Subject<INotify> = new Subject();

  typeFile: string = "txt";

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
