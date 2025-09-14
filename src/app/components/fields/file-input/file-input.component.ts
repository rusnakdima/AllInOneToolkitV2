/* sys lib */
import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { listen, UnlistenFn } from "@tauri-apps/api/event";

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
  imports: [CommonModule, MatIconModule],
  templateUrl: "./file-input.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  unlistenDragDrop: UnlistenFn | undefined;
  unlistenFilePath: UnlistenFn | undefined;

  fileName: string = "";
  filePath: string = "";

  async ngOnInit() {
    await this.setupEventListeners();
  }

  async ngOnDestroy() {
    // await this.cleanupEventListeners();
    this.typeFile = [];
  }

  async setupEventListeners() {
    try {
      await this.listenDragDrop();
      await this.getFilePath();
    } catch (error) {
      console.error("Error setting up event listeners:", error);
    }
  }

  async cleanupEventListeners() {
    try {
      if (this.unlistenDragDrop) {
        await this.unlistenDragDrop();
        this.unlistenDragDrop = undefined;
      }

      if (this.unlistenFilePath) {
        await this.unlistenFilePath();
        this.unlistenFilePath = undefined;
      }
    } catch (error) {
      console.error("Error cleaning up event listeners:", error);
    }
  }

  async listenDragDrop() {
    if (this.unlistenDragDrop) {
      await this.unlistenDragDrop();
    }

    this.unlistenDragDrop = await listen<Response<string>>("tauri://drag-drop", (event) => {
      this.notifyService.showInfo("File dropped");
      try {
        this.checkFileExt(event);
        const target = document.getElementById("fileInput") as HTMLElement;
        if (target?.id === "fileInput") {
          target.classList.remove("!border-green-500", "!border-4");
        }
      } catch (error) {
        console.error(error);
        this.notifyService.showError("Error processing dropped file.");
      }
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
      this.notifyService.showSuccess("File dropped successfully");
    } else {
      const expectedTypes = this.typeFile.join(", ");
      const errorMessage = `Invalid file type. Dropped file has extension '.${fileExt}', but expected one of: ${expectedTypes}`;
      console.error(errorMessage);
      this.notifyService.showError(errorMessage);
    }
  }

  async getFilePath() {
    if (this.unlistenFilePath) {
      await this.unlistenFilePath();
    }

    this.unlistenFilePath = await listen("send-file-path", (event: any) => {
      const payload = event.payload as Response<string>;
      if (payload) {
        if (payload.status == ResponseStatus.SUCCESS) {
          this.notifyService.showSuccess(payload.message || "File selected successfully");
          this.filePath = payload.data;
          this.fileName = payload.data.split(/[\/\\]/).pop() ?? "";
          this.reciveFileName.emit(this.fileName);
          this.getDataFile();
          this.cdr.detectChanges();
        } else {
          this.notifyService.showNotify(payload.status, payload.message);
        }
      }
    });
  }

  async getDataFile() {
    if (!this.filePath) {
      this.notifyService.showError("No file path available");
      return;
    }

    try {
      let response: Response<string>;
      if (this.typeFile.includes("xls")) {
        response = await this.fileService.getDataFromXLS<string>(this.filePath);
      } else if (this.typeFile.length > 0) {
        response = await this.fileService.getDataFromAnyFile<string>(this.filePath);
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
    this.fileName = "";
    this.filePath = "";
    this.cdr.detectChanges();

    try {
      const response = await this.fileService.chooseFile<string>(this.typeFile);
      this.notifyService.showNotify(response.status, response.message);
    } catch (error: any) {
      this.notifyService.showError(error.message ?? error.toString());
    }
  }
}
