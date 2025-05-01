/* sys lib */
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

/* materials */
import { MatIconModule } from "@angular/material/icon";

/* components */
import { KeyboardComponent } from "../../components/keyboard/keyboard.component";

interface KeyboardEvent {
  key: string;
  code: string;
  keyCode: number;
}

@Component({
  selector: "app-key-code",
  standalone: true,
  imports: [CommonModule, MatIconModule, KeyboardComponent],
  templateUrl: "./key-code.component.html",
})
export class KeyCodeComponent {
  constructor() {}

  keyCode: number = 0;
  key: string = "";
  code: string = "";
  isShow: boolean = false;
  isShowKeyboard: boolean = false;

  ngOnInit(): void {
    document.addEventListener("keydown", (event: any) => {
      this.isShow = true;
      this.keyCode = event.keyCode || event.which;
      this.key = event.key;
      this.code = event.code;
    });
  }

  handleVirtualKeyPress(event: KeyboardEvent): void {
    this.isShow = true;
    this.keyCode = event.keyCode;
    this.key = event.key;
    this.code = event.code;
  }
}
