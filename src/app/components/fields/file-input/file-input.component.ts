/* sys lib */
import { CommonModule } from "@angular/common";
import {
  ChangeDetectorRef,
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
    private cdr: ChangeDetectorRef,
    private fileService: FileService,
    private notifyService: NotifyService
  ) {}

  @Input() typeFile: Array<string> = [""];
  @Output() dataFile: EventEmitter<string> = new EventEmitter();
  @Output() reciveFileName: EventEmitter<string> = new EventEmitter();

  fileName: string = "";
  filePath: string = "";

  ngOnInit() {
    this.listenDragDrop();
    this.getFilePath();
  }

  ngOnDestroy(): void {
    this.typeFile = [];
  }

  async listenDragDrop() {
    await listen("tauri://drag-drop", (event: any) => {
      this.checkFileExt(event);
      const target = document.getElementById("fileInput") as HTMLElement;
      if (target?.id === "fileInput") {
        target.classList.remove("!border-green-500", "!border-4");
      }
      this.cdr.detectChanges();
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const target = event.target as HTMLElement;
    if (target.id == "fileInput") {
      target.classList.add("!border-green-500", "!border-4");
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
      (event.target as HTMLElement).classList.remove("!border-green-500", "!border-4");
    }
  }

  checkFileExt(event: any) {
    if (!event?.payload) {
      this.notifyService.showError("No file dropped");
      return;
    }

    let filePath: string;
    if (typeof event.payload === "object" && event.payload.paths?.length > 0) {
      filePath = event.payload.paths[0];
    } else if (typeof event.payload === "string") {
      filePath = event.payload;
    } else {
      this.notifyService.showError("Invalid drop event payload");
      return;
    }

    const fileExt = (
      filePath
        .split(/[\/\\]/)
        .pop()
        ?.split(".")
        .pop() ?? ""
    ).toLowerCase();
    const normalizedExt = ["xlsx", "xlsm", "xls"].includes(fileExt) ? "xls" : fileExt;

    if (this.typeFile.includes(normalizedExt)) {
      this.filePath = filePath;
      this.fileName = filePath.split(/[\/\\]/).pop() ?? "";
      this.reciveFileName.emit(this.fileName);
      this.getDataFile();
      this.cdr.detectChanges();
    } else {
      this.notifyService.showError(`Invalid file type. Expected: ${this.typeFile.join(", ")}`);
    }
  }

  async getFilePath() {
    await listen("send-file-path", (event: any) => {
      this.filePath = event.payload;
      this.fileName = event.payload.split(/[\/\\]/).pop() ?? "";
      this.notifyService.showInfo("File path received");
      this.reciveFileName.emit(this.fileName);
      this.getDataFile();
      this.cdr.detectChanges();
    });
  }

  async getDataFile() {
    if (!this.filePath) {
      this.notifyService.showError("No file path available");
      return;
    }

    try {
      let response: Response;
      if (this.typeFile.includes("xls")) {
        response = await this.fileService.getDataFromXLS(this.filePath);
      } else if (this.typeFile.length > 0) {
        response = await this.fileService.getDataFromAnyFile(this.filePath);
      } else {
        this.notifyService.showError("No valid file type specified");
        return;
      }

      if (response.status == ResponseStatus.SUCCESS) {
        this.dataFile.emit(response.data);
      } else {
        this.notifyService.showError(response.message || "Failed to read file");
      }
    } catch (err) {
      console.error(err);
      this.notifyService.showError("Error reading file");
    }
  }

  async chooseFile() {
    try {
      this.fileName = "";
      this.filePath = "";
      this.cdr.detectChanges();

      const response: Response = await this.fileService.chooseFile(this.typeFile);
      if (response.status == ResponseStatus.ERROR) {
        this.notifyService.showError(response.message || "Failed to open file dialog");
        return;
      }

      this.notifyService.showInfo("Please select a file");
    } catch (error) {
      console.error(error);
      this.notifyService.showError(String(error));
    }
  }
}
