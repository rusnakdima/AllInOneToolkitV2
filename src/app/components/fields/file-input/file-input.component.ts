/* sys lib */
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

/* materials */
import { MatIconModule } from "@angular/material/icon";

/* models */
import { Response, ResponseStatus } from "@models/response";

/* services */
import { FileService } from "@services/file.service";
import { NotifyService } from "@services/notify.service";

@Component({
  selector: "app-file-input",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, MatIconModule],
  templateUrl: "./file-input.component.html",
})
export class FileInputComponent implements OnInit, OnDestroy {
  constructor(
    private fileService: FileService,
    private notifyService: NotifyService
  ) {}

  @Input() typeFile: Array<string> = [""];
  @Output() dataFile: EventEmitter<string> = new EventEmitter();
  @Output() reciveFileName: EventEmitter<string> = new EventEmitter();

  fileName: string = "";
  filePath: string = "";

  private unlisten: (() => void) | null = null;

  ngOnInit() {
    listen("tauri://drag-drop", (event) => {
      this.checkFileExt(event);
      const target = document.getElementById("fileInput") as HTMLElement;
      if (target.id == "fileInput") {
        target.classList.remove("!border-green-500");
        target.classList.remove("!border-4");
      }
    });

    this.getFilePath();
  }

  ngOnDestroy(): void {
    this.typeFile = [];
    if (this.unlisten) {
      this.unlisten();
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const target = event.target as HTMLElement;
    if (target.id == "fileInput") {
      target.classList.add("!border-green-500");
      target.classList.add("!border-4");
    }
  }

  onDragEnter(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if ((event.target as HTMLElement).id == "fileInput") {
      (event.target as HTMLElement).classList.remove("!border-green-500");
    }
  }

  checkFileExt(event: any) {
    if (event) {
      if (typeof event.payload == "object") {
        this.filePath = (event.payload as { [key: string]: any })["paths"][0];
      } else if (typeof event.payload == "string") {
        this.filePath = event.payload;
      }
      let fileExt =
        (this.filePath.replace(/\\/g, "/").split("/").pop() ?? "").split(".").pop() ?? "";
      if (fileExt == "xlsx" || fileExt == "xlsm" || fileExt == "xls") {
        fileExt = "xls";
      }
      if (this.typeFile.includes(fileExt)) {
        this.fileName = this.filePath.split(/[\/\\]/g).pop() ?? "";
        this.reciveFileName.next(this.fileName);
        this.getDataFile();
      } else {
        this.notifyService.showError("Invalid file type");
      }
    }
  }

  async getFilePath() {
    this.unlisten = await listen("send_file_path", (event: any) => {
      this.fileName = event.payload.split(/[\/\\]/g).pop();
      this.filePath = event.payload;
      this.reciveFileName.next(this.fileName);
      this.getDataFile();
    });
  }

  async getDataFile() {
    if (this.typeFile.includes("xls")) {
      await this.fileService
        .getDataFromXLS(this.filePath)
        .then((data: Response) => {
          if (data.status == ResponseStatus.SUCCESS) {
            this.dataFile.next(data.data);
          }
        })
        .catch((err: any) => {
          console.error(err);
          this.notifyService.showError(err);
        });
    } else if (this.typeFile.length > 0) {
      await this.fileService
        .getDataFromAnyFile(this.filePath)
        .then((data: Response) => {
          if (data.status == ResponseStatus.SUCCESS) {
            this.dataFile.next(data.data);
          }
        })
        .catch((err: any) => {
          console.error(err);
          this.notifyService.showError(err);
        });
    }
  }

  async chooseFile() {
    await this.fileService
      .chooseFile(this.typeFile)
      .then((data: Response) => {
        this.notifyService.showNotify(data.status, data.message);
      })
      .catch((err) => {
        console.error(err);
        this.notifyService.showError(err);
      });
  }
}
