/* sys lib */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

/* materials */
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

/* helpers */
import { Common } from '@helpers/common';

@Component({
  selector: 'app-clock-converter',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './clock-converter.view.html'
})
export class ClockConverterView implements OnInit {
  constructor() {}

  timestamp: number = 0;
  currentTime: string = '';
  inputTS: number = 0;
  inputYear: number = 0;
  inputMonth: number = 0;
  inputDate: number = 0;
  inputHours: number = 0;
  inputMinutes: number = 0;
  inputSeconds: number = 0;

  isShowInfoTS: boolean = false;
  isShowInfoDnT: boolean = false;

  ngOnInit(): void {
    setInterval(() => {
      this.timestamp = Math.floor(new Date().getTime() / 1000);
      this.currentTime = new Date().toLocaleTimeString(undefined, { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    }, 1000);

    this.inputTS = Math.floor(new Date().getTime());
    this.inputYear = new Date().getFullYear();
    this.inputMonth = new Date().getMonth() + 1;
    this.inputDate = new Date().getDate();
    this.inputHours = new Date().getHours(); 
    this.inputMinutes = new Date().getMinutes(); 
    this.inputSeconds = new Date().getSeconds(); 
  }

  setTS(event: any) {
    this.inputTS = parseInt(event.target.value);
  }

  setComponentDateTime(event: any, type: string) {
    switch (type) {
      case "year":
        this.inputYear = parseInt(event.target.value);
        break;
      case "month":
        this.inputMonth = parseInt(event.target.value);
        break;
      case "date":
        this.inputDate = parseInt(event.target.value);
        break;
      case "hours":
        this.inputHours = parseInt(event.target.value);
        break;
      case "minutes":
        this.inputMinutes = parseInt(event.target.value);
        break;
      case "seconds":
        this.inputSeconds = parseInt(event.target.value);
        break;
      default:
        break;
    }
  }

  formatUTC(type: string): string {
    switch (type) {
      case "ts":
        const date = new Date(this.inputTS);
        return date.toUTCString();

      case "dt":
        const dateDnT = new Date(this.inputYear, this.inputMonth - 1, this.inputDate, this.inputHours, this.inputMinutes, this.inputSeconds);
        return dateDnT.toUTCString();

      default:
        return "";
    }
  }

  formatLocal(type: string): string {
    switch (type) {
      case "ts":
        const date = new Date(this.inputTS);
        return date.toLocaleString();

      case "dt":
        const dateDnT = new Date(this.inputYear, this.inputMonth - 1, this.inputDate, this.inputHours, this.inputMinutes, this.inputSeconds);
        return dateDnT.toLocaleString();

      default:
        return "";
    }
  }

  getTimeAgo(type: string): string {
    switch (type) {
      case "ts":
        if (new Date().getTime() > this.inputTS) {
          return Common.formatTimeAgo(this.inputTS);
        } else if (new Date().getTime() <= this.inputTS) {
          return Common.formatTimeIn(this.inputTS);
        } else {
          return "Invalid timestamp";
        }

      case "dt":
        const tempDT = new Date(this.inputYear, this.inputMonth - 1, this.inputDate, this.inputHours, this.inputMinutes, this.inputSeconds);
        if (new Date().getTime() > tempDT.getTime()) {
          return Common.formatTimeAgo(tempDT);
        } else if (new Date().getTime() <= tempDT.getTime()) {
          return Common.formatTimeIn(tempDT);
        } else {
          return "Invalid date & time";
        }

      default:
        return "";
    }
  }
}
