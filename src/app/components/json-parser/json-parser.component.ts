/* sys lib */
import { CommonModule } from "@angular/common";
import { Component, ElementRef, ViewChild, Input, OnInit, AfterViewInit } from "@angular/core";
import { NotifyService } from "@services/notify.service";
import { Subject } from "rxjs";

@Component({
  selector: "app-json-parser",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./json-parser.component.html",
})
export class JsonParserComponent implements OnInit {
  constructor(private notifyService: NotifyService) {}

  @ViewChild("jsonContainer") jsonContainer!: ElementRef;

  @Input() parseData$: Subject<string> = new Subject<string>();
  jsonString: string | null = null;

  jsonData: { [key: string]: any } | null = null;
  colorPalette = ["#ADD8E6", "#90EE90", "#FFD700", "#FFA500", "#FF4500"];

  keyColor: string = "#e6edf3";
  stringColor: string = "#a5d6ff";
  numberColor: string = "#79c0ff";
  booleanColor: string = "#79c0ff";

  bracketColors: Array<string> = ["#56d364", "#e3b341", "#ff9bce"];

  ngOnInit(): void {
    this.parseData$.subscribe((data: string) => {
      this.jsonString = data;
      this.processJson();
    });
  }

  processJson() {
    if (this.jsonString) {
      try {
        this.jsonData = JSON.parse(this.jsonString);
        this.renderToHtml();
      } catch (error) {
        this.notifyService.showError("Error parsing JSON");

        this.jsonData = null;
        this.renderToHtml();
      }
    } else {
      this.notifyService.showWarning("No JSON string provided.");
      this.jsonData = null;
      this.renderToHtml();
    }
  }

  parseArr(arr: Array<any>, level: number = 1) {
    let html: string = "<ul>";

    arr.forEach((value: any) => {
      html += `<li style="margin-left: ${level * 8}px">`;
      if (!value && value == null) {
        html += `<span style="color: ${this.stringColor}">""</span>`;
      } else if (Array.isArray(value)) {
        html += `<li><span style="color:${this.bracketColors[(level - 1) % this.bracketColors.length]}">[</span></li>`;
        html += `${this.parseArr(value, level + 1)}`;
        html += `<li><span style="color:${this.bracketColors[(level - 1) % this.bracketColors.length]}">]</span>,</li>`;
      } else if (!Array.isArray(value) && typeof value == "object") {
        html += `<li><span style="color:${this.bracketColors[(level - 1) % this.bracketColors.length]}">{</span></li>`;
        html += `${this.parseObj(value, level + 1)}`;
        html += `<li><span style="color:${this.bracketColors[(level - 1) % this.bracketColors.length]}">}</span>,</li>`;
      } else if (typeof value == "string") {
        html += `<li><span style="color: ${this.stringColor}">"${value}"</span>,</li>`;
      } else if (typeof value == "number") {
        html += `<li><span style="color: ${this.numberColor}">${value}</span>,</li>`;
      } else if (typeof value == "boolean") {
        html += `<li><span style="color: ${this.booleanColor}">${value}</span>,</li>`;
      } else {
        html += `<li><span style="color: ${this.stringColor}">"${value}"</span>,</li>`;
      }
      html += "</li>";
    });

    html += "</ul>";
    return html;
  }

  parseObj(obj: { [key: string]: any }, level: number = 1): string {
    let html: string = "<ul>";

    if (level == 1) {
      html += `<li><span style="color:${this.bracketColors[(level - 1) % this.bracketColors.length]}">{</span></li>`;
    }

    Object.entries(obj).forEach(([key, value]) => {
      html += `<li style="margin-left: ${level * 8}px">`;
      if (value == null) {
        html += `<li><span style="color: ${this.keyColor}">${key}:</span> <span style="color: ${this.stringColor}">null,</span></li>`;
      } else if (Array.isArray(value) && typeof value[0] == "object") {
        html += `<li><span style="color: ${this.keyColor}">${key}:</span> <span style="color:${this.bracketColors[(level - 1) % this.bracketColors.length]}">[</span></li>`;
        html += `${this.parseArr(value, level + 1)}`;
        html += `<li><span style="color: ${this.bracketColors[(level - 1) % this.bracketColors.length]}">]</span>,</li>`;
      } else if (!Array.isArray(value) && typeof value == "object") {
        html += `<li><span style="color: ${this.keyColor}">${key}:</span> <span style="color:${this.bracketColors[level % this.bracketColors.length]}">{</span></li>`;
        html += `${this.parseObj(value, level + 1)}`;
        html += `<li><span style="color: ${this.bracketColors[level % this.bracketColors.length]}">}</span>,</li>`;
      } else if (typeof value == "string") {
        html += `<li><span style="color: ${this.keyColor}">${key}:</span> <span style="color: ${this.stringColor}">"${value}"</span>,</li>`;
      } else if (typeof value == "number") {
        html += `<li><span style="color: ${this.keyColor}">${key}:</span> <span style="color: ${this.numberColor}">${value}</span>,</li>`;
      } else if (typeof value == "boolean") {
        html += `<li><span style="color: ${this.keyColor}">${key}:</span> <span style="color: ${this.booleanColor}">${value}</span>,</li>`;
      } else {
        html += `<li><span style="color: ${this.keyColor}">${key}:</span> <span style="color: ${this.stringColor}">"${value}"</span>,</li>`;
      }
      html += "</li>";
    });

    if (level == 1) {
      html += `<li><span style="color: ${this.bracketColors[(level - 1) % this.bracketColors.length]}">}</span></li>`;
    }
    html += "</ul>";

    return html;
  }

  renderToHtml() {
    const container = this.jsonContainer.nativeElement;
    container.innerHTML = "";

    if (this.jsonData) {
      container.innerHTML = this.parseObj(this.jsonData);
    }
  }
}
