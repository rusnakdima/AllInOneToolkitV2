/* system libraries */
import { CommonModule } from "@angular/common";
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { listen } from "@tauri-apps/api/event";
import { Subject } from "rxjs";

/* services */
import { FileService } from "@services/file.service";

/* components */
import {
  INotify,
  WindowNotifyComponent,
} from "@views/shared/window-notify/window-notify.component";
import { Response } from "@models/response";

@Component({
  selector: "app-file-input",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, WindowNotifyComponent],
  templateUrl: "./file-input.component.html",
})
export class FileInputComponent implements OnInit, OnDestroy {
  constructor(private fileService: FileService) {}

  dataNotify: Subject<INotify> = new Subject();

  @Input() typeFile: string = "";
  @Output() dataFile: EventEmitter<string> = new EventEmitter();
  @Output() reciveFileName: EventEmitter<string> = new EventEmitter();

  fileName: string = "";
  filePath: string = "";

  ngOnInit() {
    listen("tauri://drag-drop", (event) => {
      if (event) {
        this.filePath = (event.payload as { [key: string]: any })["paths"][0];
        let fileExt = ((this.filePath.replace(/\\/g, "/").split("/").pop() ?? '').split(".")[1] ?? '');
        if (fileExt == "xlsx" || fileExt == "xlsm" || fileExt == "xls") {
          fileExt = "xls";
        }
        if (fileExt == this.typeFile) {
          this.fileName = this.filePath.split(/[\/\\]/g).pop() ?? "";
          this.reciveFileName.next(this.fileName);
          this.getDataFile();
        } else {
          this.dataNotify.next({
            status: "error",
            text: "Invalid file type",
          });
        }
      }
    });

    this.getFilePath();
  }

  ngOnDestroy(): void {
    this.typeFile = "";
  }

  async getFilePath() {
    await listen("send_file_path", (event: any) => {
      this.fileName = event.payload.split(/[\/\\]/g).pop();
      this.filePath = event.payload;
      this.reciveFileName.next(this.fileName);
      this.getDataFile();
    });
  }

  async getDataFile() {
    if (this.typeFile == "xls") {
      await this.fileService.getDataFromXLS(this.filePath)
        .then((data: Response) => {
          if (data.status == "success") {
            this.dataFile.next(data.data);
          }
        })
        .catch((err: any) => {
          console.error(err);
          this.dataNotify.next({ status: "error", text: err });
        });
    } else if (this.typeFile != "") {
      await this.fileService.getDataFromAnyFile(this.filePath)
        .then((data: Response) => {
          if (data.status == "success") {
            this.dataFile.next(data.data);
          }
        })
        .catch((err: any) => {
          console.error(err);
          this.dataNotify.next({ status: "error", text: err });
        });
    }
  }

  async chooseFile() {
    await this.fileService.chooseFile(this.typeFile).catch((err) => {
      console.error(err);
      this.dataNotify.next({ status: "error", text: err });
    });
  }
}
