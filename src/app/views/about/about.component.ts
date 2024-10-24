/* system libraries */
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { Subject } from "rxjs";

/* env */
import { environment } from "@env/environment";

/* services */
import { AboutService } from "@services/about.service";

/* components */
import {
  INotify,
  WindowNotifyComponent,
} from "@views/shared/window-notify/window-notify.component";

@Component({
  selector: "app-about",
  standalone: true,
  providers: [AboutService],
  imports: [CommonModule, HttpClientModule, WindowNotifyComponent],
  templateUrl: "./about.component.html",
})
export class AboutComponent {
  constructor(private aboutService: AboutService) {}

  dataNotify: Subject<INotify> = new Subject();

  version: string = environment.version;
  dateVersion: string = localStorage["dateVersion"] || "Unknown";
  dateCheck: string = localStorage["dateCheck"] || "Unknown";

  nameFile: string = "";
  lastVersion: string = "";
  pathUpdate: string = "";

  windUpdates: boolean = false;
  downloadProgress: boolean = false;

  ngOnInit(): void {
    this.getDate();
  }

  matchVersion(lastVer: string) {
    const v1Components = lastVer.split(".").map(Number);
    const v2Components = this.version.split(".").map(Number);

    for ( let i = 0; i < Math.max(v1Components.length, v2Components.length); i++ ) {
      const v1Value = v1Components[i] || 0;
      const v2Value = v2Components[i] || 0;

      if (v1Value < v2Value) {
        return false;
      } else if (v1Value > v2Value) {
        return true;
      }
    }

    return false;
  }

  formatDate(date: string) {
    return new Date(date).toISOString().split("T")[0];
  }

  getDate() {
    this.aboutService
      .getBinaryNameFile()
      .then((data: any) => {
        if (data) {
          if (data != "Unknown") {
            this.nameFile = data;
          }
        } else {
          throw Error(data);
        }
      })
      .catch((err: any) => {
        console.error(err);
        this.dataNotify.next({ status: "error", text: err });
      });

    this.aboutService.getDate(this.version).subscribe({
      next: (res: any) => {
        if (res && res.published_at) {
          localStorage["dateVersion"] = String(
            this.formatDate(res.published_at)
          );
          this.dateVersion = String(this.formatDate(res.published_at));
        } else {
          throw Error("Invalid request");
        }
      },
      error: (err: any) => {
        console.error(err);
        this.downloadProgress = false;
        this.dataNotify.next({
          status: "error",
          text: err.status + " — " + err.error.message,
        });
      },
    });
  }

  checkUpdate() {
    localStorage["dateCheck"] = String(
      this.formatDate(new Date().toUTCString())
    );
    this.aboutService.checkUpdate().subscribe({
      next: (res: any) => {
        if (res && res.tag_name) {
          const lastVer: string = res.tag_name;
          setTimeout(() => {
            if (this.matchVersion(lastVer)) {
              this.dataNotify.next({
                status: "warning",
                text: "A new version is available!",
              });
              this.windUpdates = true;
              this.lastVersion = lastVer;
            } else {
              this.dataNotify.next({
                status: "success",
                text: "You have the latest version!",
              });
            }
          }, 1000);
        } else {
          throw Error("Invalid request");
        }
      },
      error: (err: any) => {
        console.error(err);
        this.dataNotify.next({
          status: "error",
          text: err.status + " — " + err.error.message,
        });
      },
    });
  }

  downloadFile() {
    if (this.nameFile != "") {
      (this.downloadProgress = true),
        this.dataNotify.next({
          status: "warning",
          text: "Wait until the program update is downloaded!",
        });
      this.aboutService
        .downloadUpdate(this.lastVersion, this.nameFile)
        .then((data: any) => {
          if (data) {
            this.dataNotify.next({
              status: "success",
              text: "The new version of the program has been successfully downloaded!",
            });
            this.pathUpdate = data;
          } else {
            throw Error(data);
          }
        })
        .catch((err: any) => {
          console.error(err);
          this.dataNotify.next({ status: "error", text: err });
        });
      this.downloadProgress = false;
      this.windUpdates = false;
    } else {
      this.dataNotify.next({
        status: "error",
        text: "System definition error! It is impossible to find a file for this OS!",
      });
    }
  }

  openFile() {
    this.aboutService.openFile(this.pathUpdate).catch((err: any) => {
      console.error(err);
      this.dataNotify.next({ status: "error", text: err });
    });
  }
}
