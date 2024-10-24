/* system libraries */
import { CommonModule } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { Subject } from "rxjs";

/* services */
import { VirusTotalService } from "@services/virus-total.service";

/* components */
import {
  INotify,
  WindowNotifyComponent,
} from "@views/shared/window-notify/window-notify.component";
import { Response } from "@models/response";

@Component({
  selector: "app-virus-total",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, WindowNotifyComponent],
  templateUrl: "./virus-total.component.html",
})
export class VirusTotalComponent {
  constructor(private virusTotalService: VirusTotalService) {}

  dataNotify: Subject<INotify> = new Subject();

  urlInput: string = "";
  reqText: string = "";
  isChecked: boolean = false;

  circleBlockColor: string = "";
  milicious: number = 0;
  allAntivirus: number = 0;
  listAntiviruses: Array<any> = [];

  setData(event: any) {
    this.urlInput = event.target.value;
  }

  async checkOnVirus() {
    this.reqText = "The request is being executed! Wait...";
    if (this.urlInput == "") {
      this.dataNotify.next({
        status: "error",
        text: "Please enter a URL",
      });
      this.reqText = "Errors occurred when executing the request!";
    } else {
      this.dataNotify.next({
        status: "warning",
        text: "Checking...",
      });

      const url = btoa(this.urlInput).replace(/=/g, "");
      const apiUrl = `https://www.virustotal.com/api/v3/urls/${encodeURIComponent(
        url
      )}`;

      this.virusTotalService
        .checkOnViruses(apiUrl)
        .then((data: Response) => {
          if (data.status == "success") {
            if (data.data && data.data != "") {
              const json = data.data;

              const colors = [
                "green-600",
                "yellow-300",
                "orange-500",
                "red-600",
              ];

              this.milicious =
                json.data.attributes.last_analysis_stats.malicious || 0;
              this.allAntivirus = Object.keys(
                json.data.attributes.last_analysis_results
              ).length;
              this.circleBlockColor =
                colors[
                  Math.floor(
                    (this.milicious / this.allAntivirus) * colors.length
                  )
                ];

              this.listAntiviruses = [];
              const sites_analysis = json.data.attributes.last_analysis_results;
              Object.values(sites_analysis).forEach((elem: any) => {
                this.listAntiviruses.push({
                  status: elem.result,
                  name: elem.engine_name,
                });
              });

              this.reqText = "";
              this.isChecked = true;
              this.dataNotify.next({
                status: "success",
                text: "Checked ended successfully!",
              });
            }
          }
        })
        .catch((err) => {
          console.log(err);
          this.dataNotify.next({
            status: "error",
            text: err.message,
          });
          this.reqText = "Errors occurred when executing the request!";
        });
    }
  }
}
