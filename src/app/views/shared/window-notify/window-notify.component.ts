/* system libraries */
import { CommonModule } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from "@angular/core";
import { Subject } from "rxjs";

export interface INotify {
  status: "success" | "warning" | "error";
  text: string;
}

@Component({
  selector: "app-window-notify",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule],
  templateUrl: "./window-notify.component.html",
})
export class WindowNotifyComponent {
  @Input() dataNotify: Subject<INotify> = new Subject();

  windNotify: boolean = false;
  color: string = "";
  text: string = "";
  width: number = 0;

  interval: any;

  ngOnInit() {
    this.dataNotify.subscribe((value: INotify) => {
      if (value.text == "") {
        return;
      }
      switch (value.status) {
        case 'success':
          this.color = 'bg-green-700';
          break;
        case 'warning':
          this.color = 'bg-yellow-500';
          break;
        case 'error':
          this.color = 'bg-red-700';
          break;
        default:
          return;
      }
      this.text = value.text;
      this.alertNotify();
    });
  }

  alertNotify() {
    this.windNotify = true;
    setTimeout(() => {
      let timeNotify = document.querySelector(
        "#timeNotify"
      ) as HTMLDivElement | null;
      if (timeNotify != null) {
        if (this.interval) {
          clearInterval(this.interval);
        }

        this.width = 100;
        timeNotify.style.width = `${this.width}%`;

        this.interval = setInterval(() => {
          this.width -= 0.3;
          if (this.width < 0) {
            this.width = 0;
            this.windNotify = false;
            clearInterval(this.interval);
          }
          if (timeNotify != null) timeNotify.style.width = `${this.width}%`;
        }, 10);
      }
    }, 10);
  }
}
