/* sys lib */
import { CommonModule } from "@angular/common";
import { Component, HostListener, Input, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { v4 as UUID } from "uuid";
import { CdkDragDrop, CdkDropList, DragDropModule } from "@angular/cdk/drag-drop";
import { Subject } from "rxjs";

/* material */
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatSelectModule } from "@angular/material/select";
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { MatCheckboxModule, MatCheckboxChange } from "@angular/material/checkbox";

/* helpers */
import { Common } from "@helpers/common";

/* models */
import { Response, ResponseStatus } from "@models/response";
import { Collection } from "@models/collection";
import { UndoItem } from "@models/undo_item";
import {
  BodyData,
  BodyValue,
  RecObj,
  Request,
  RequestResponse,
  TypeRequest,
} from "@models/request";

/* services */
import { UrlRequestsService } from "@services/url-requests.service";
import { NotifyService } from "@services/notify.service";

/* components */
import { JsonParserComponent } from "@components/json-parser/json-parser.component";

@Component({
  selector: "app-url-requests",
  standalone: true,
  providers: [UrlRequestsService],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatExpansionModule,
    MatSelectModule,
    MatTabsModule,
    MatIconModule,
    MatCheckboxModule,
    DragDropModule,
    CdkDropList,
    JsonParserComponent,
  ],
  templateUrl: "./url-requests.view.html",
})
export class UrlRequestsView implements OnInit {
  constructor(
    private urlRequestsService: UrlRequestsService,
    private notifyService: NotifyService
  ) {}

  @Input() parseData$: Subject<string> = new Subject<string>();

  widthLeftSidebar: number = 300;
  widthRightSidebar: number = 0;
  isResizing = false;

  savedListCollections: Array<Collection> = [];
  listCollections: Array<Collection> = [];
  listTypesRequest: Array<{ title: string; color: string }> = [];
  colorTypeRequest = {
    [TypeRequest.GET]: "text-green-500",
    [TypeRequest.POST]: "text-yellow-500 dark:text-yellow-300",
    [TypeRequest.PUT]: "text-blue-500",
    [TypeRequest.DEL]: "text-red-500",
  };
  typeEditorData: { headers: "table" | "json"; body: "table" | "json"; params: "table" | "json" } =
    {
      headers: "table",
      body: "table",
      params: "table",
    };

  prevTitleCollection: string = "";
  prevTitleRequest: string = "";

  infoCollection: Collection | null = null;
  infoRequest: Request | null = null;

  editingObj: RecObj | BodyData | null = null;
  editingCol: string = "";
  editingRow: number = -1;

  undoStack: UndoItem[] = [];

  selectedTabIndex: number = 0;
  response: string = "";
  currentResponseId: string = "";
  isResponseCollapsed: boolean = false;
  windowInnerWidth: number = 0;

  isShowSidebar: boolean = false;

  isJsonAsString = Common.isJsonAsString;
  isHTML = Common.isHTML;
  isXML = Common.isXML;

  ngOnInit(): void {
    document.addEventListener("mousedown", (e: any) => {
      if (
        e.target.tagName.toLowerCase() !== "input" &&
        e.target.tagName.toLowerCase() !== "textarea"
      ) {
        this.editingCol = "";
        this.editingRow = -1;
        this.editingObj = null;
      }
    });

    document.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "z") {
        event.preventDefault();
        this.undo();
      }
    });

    this.widthRightSidebar = window.innerWidth - 300;
    this.windowInnerWidth = window.innerWidth;
    setInterval(() => {
      this.windowInnerWidth = window.innerWidth;
      this.widthRightSidebar = window.innerWidth - this.widthLeftSidebar - 10;
    }, 500);

    if (window.innerWidth > 768) {
      this.isShowSidebar = true;
    } else {
      this.isShowSidebar = false;
    }

    Object.entries(this.colorTypeRequest).forEach((item) => {
      this.listTypesRequest.push({ title: item[0], color: item[1] });
    });

    this.urlRequestsService
      .getData<Array<any>>()
      .then((response: Response<Array<any>>) => {
        if (response.status == ResponseStatus.SUCCESS) {
          this.savedListCollections = response.data;
          this.listCollections = this.savedListCollections;
        } else {
          this.notifyService.showError("Failed to load data");
        }
      })
      .catch((err: Response<string>) => {
        this.notifyService.showError(err.message ?? err.toString());
      });
  }

  onMouseDown(event: MouseEvent): void {
    this.isResizing = true;
    event.preventDefault();
  }

  @HostListener("document:mousemove", ["$event"])
  onMouseMove(event: MouseEvent): void {
    if (this.isResizing) {
      if (event.clientX <= 700) {
        this.widthLeftSidebar = Math.max(200, event.clientX);
      }
      this.widthRightSidebar = window.innerWidth - this.widthLeftSidebar;
    }
  }

  @HostListener("document:mouseup")
  onMouseUp(): void {
    this.isResizing = false;
  }

  dropCollections(event: CdkDragDrop<string[]>) {
    const prevElement = this.listCollections[event.previousIndex];
    this.listCollections.splice(event.previousIndex, 1);
    this.listCollections.splice(event.currentIndex, 0, prevElement);
    this.saveData();
  }

  dropRequests(event: CdkDragDrop<string[]>, indexCollection: number) {
    const prevElement = this.listCollections[indexCollection].requests[event.previousIndex];
    this.listCollections[indexCollection].requests.splice(event.previousIndex, 1);
    this.listCollections[indexCollection].requests.splice(event.currentIndex, 0, prevElement);
    this.saveData();
  }

  setTitle(event: any, typeData: "collection" | "request", data: any) {
    if (event.key == "Enter") {
      if (typeData == "collection") {
        this.confirmRenameCollection(event, data);
      } else if (typeData == "request") {
        this.confirmRenameRequest(event, data);
      }
    } else if (event.key == "Escape") {
      if (typeData == "collection") {
        this.cancelRenameCollection(event, data);
      } else if (typeData == "request") {
        this.cancelRenameRequest(event, data);
      }
    }
  }

  setUrl(event: any) {
    if (event.key == "Enter") {
      this.saveData();
    }
  }

  isSaved(): boolean {
    if (this.infoRequest) {
      const idReq = this.infoRequest.id;
      const savedRequest = () => {
        for (let collection of this.savedListCollections) {
          const request = collection.requests.find((req) => req.id === idReq);
          if (request) {
            return request;
          }
        }
        return null;
      };

      if (savedRequest()) {
        return JSON.stringify(savedRequest()) == JSON.stringify(this.infoRequest);
      }
    }

    return false;
  }

  createCollection() {
    const collection: Collection = {
      id: UUID(),
      title: `New collection ${this.listCollections.length + 1}`,
      editTitle: false,
      requests: [],
    };
    this.listCollections.push(collection);

    this.saveData();
  }

  renameCollection(coll: Collection) {
    coll.editTitle = true;
    this.prevTitleCollection = coll.title;
  }

  confirmRenameCollection(event: any, coll: Collection) {
    event.stopPropagation();
    event.preventDefault();
    this.undoStack.push({
      type: "collectionTitle",
      oldValue: coll.title,
      newValue: this.prevTitleCollection,
      collectionId: coll.id,
    });
    coll.editTitle = false;
    coll.title = this.prevTitleCollection;
    this.prevTitleCollection = "";

    this.saveData();
  }

  cancelRenameCollection(event: any, coll: Collection) {
    event.stopPropagation();
    event.preventDefault();
    coll.editTitle = false;
    this.prevTitleCollection = "";
  }

  deleteCollection(index: number) {
    this.listCollections.splice(index, 1);
    this.infoCollection = null;
    this.infoRequest = null;

    this.saveData();
  }

  createRequest(coll: Collection) {
    const request: Request = {
      id: UUID(),
      title: `New request ${coll.requests.length + 1}`,
      editTitle: false,
      typeReq: TypeRequest.GET,
      url: "",
      params: [{ key: "", value: "", isActive: false }],
      headers: [
        { key: "Accept", value: "*/*", isActive: true },
        { key: "Accept-Encoding", value: "utf-8", isActive: false },
        { key: "Content-Type", value: "application/json", isActive: true },
        { key: "Connection", value: "keep-alive", isActive: true },
        {
          key: "User-Agent",
          value: "PostmanRuntime/7.43.0",
          isActive: true,
        },
        { key: "", value: "", isActive: false },
      ],
      body: [{ key: "", value: { type: "String", value: "" }, isActive: false }],
      responses: [],
    };
    coll.requests.push(request);

    this.infoCollection = coll;
    this.infoRequest = coll.requests[coll.requests.length - 1];

    this.saveData();
  }

  renameRequest(req: Request) {
    req.editTitle = true;
    this.prevTitleRequest = req.title;
  }

  confirmRenameRequest(event: any, req: Request) {
    event.preventDefault();
    this.undoStack.push({
      type: "requestTitle",
      oldValue: req.title,
      newValue: this.prevTitleRequest,
      requestId: req.id,
    });
    req.editTitle = false;
    req.title = this.prevTitleRequest;
    this.prevTitleRequest = "";

    this.saveData();
  }

  cancelRenameRequest(event: any, req: Request) {
    event.preventDefault();
    req.editTitle = false;
    this.prevTitleRequest = "";
  }

  deleteRequest(coll: Collection, index: number) {
    coll.requests.splice(index, 1);
    this.infoRequest = null;

    this.saveData();
  }

  deleteRec(list: Array<RecObj>, index: number) {
    list.splice(index, 1);
    if (list.length == 0) {
      list.push({
        key: "",
        value: "",
        isActive: false,
      });
    }
  }

  dropTableRecords(event: CdkDragDrop<any>, type: string) {
    if (this.infoRequest) {
      const prevIndex = event.previousIndex;
      const currentIndex = event.currentIndex;

      const list = this.infoRequest[type as keyof typeof this.infoRequest] as any[];

      if (prevIndex < list.length - 1 && currentIndex < list.length - 1) {
        const prevElement = list[prevIndex];
        list.splice(prevIndex, 1);
        list.splice(currentIndex, 0, prevElement);
        this.saveData();
      }
    }
  }

  getList(typeData: "params" | "headers" | "body"): Array<RecObj | BodyData> {
    if (this.infoRequest) {
      return this.infoRequest[typeData];
    }

    return [];
  }

  createObj(typeObj: "params" | "headers" | "body") {
    if (this.infoRequest) {
      switch (typeObj) {
        case "params":
        case "headers":
          this.infoRequest[typeObj].push({
            key: "",
            value: "",
            isActive: false,
          });
          break;
        case "body":
          this.infoRequest[typeObj].push({
            key: "",
            value: { type: "String", value: "" },
            isActive: false,
          });
          break;
        default:
          break;
      }
    }
  }

  editObj(row: number, field: "key" | "value", data: RecObj) {
    this.editingRow = row;
    this.editingCol = field;
    this.editingObj = data;
  }

  selAll(event: MatCheckboxChange, typeObj: "params" | "headers" | "body") {
    if (this.infoRequest) {
      this.infoRequest[typeObj].forEach((rec) => (rec.isActive = event.checked));
    }
  }

  inputChange(
    event: any,
    row: number,
    typeObj: "params" | "headers" | "body",
    field: "key" | "value"
  ) {
    if (this.editingObj) {
      const oldVal = this.editingObj[field];
      if (field == "value" && typeObj == "body") {
        this.editingObj[field] = this.parseBodyValue(event.target.value);
      } else {
        this.editingObj[field] = event.target.value;
      }

      this.undoStack.push({
        type: typeObj.slice(0, -1) as "param" | "header" | "body",
        oldValue: oldVal,
        newValue: this.editingObj[field],
        index: row,
        field,
        requestId: this.infoRequest!.id,
      });

      if (this.infoRequest) {
        if (this.infoRequest[typeObj].findIndex((rec) => rec.key == "") == -1) {
          this.createObj(typeObj);
        }
        this.infoRequest[typeObj][row][field] = this.editingObj[field];
        if (field == "key") {
          this.infoRequest[typeObj][row].isActive = true;
        }
      }
    }
  }

  parseUrl() {
    if (this.infoRequest && this.infoRequest.url != "") {
      if (this.infoRequest.url.indexOf("http") == -1) {
        this.infoRequest.url = "http://" + this.infoRequest.url;
      }
      const url = new URL(this.infoRequest.url);
      if (url.search !== "") {
        this.infoRequest.params = [];
        url.searchParams.forEach((value, key) => {
          this.infoRequest!.params.push({
            key,
            value,
            isActive: true,
          });
        });
        this.createObj("params");
        this.undoStack.push({
          type: "url",
          oldValue: this.infoRequest.url,
          newValue: url.origin + url.pathname + url.hash,
          requestId: this.infoRequest.id,
        });
        this.infoRequest.url = url.origin + url.pathname + url.hash;
      }
    }
  }

  getRawHeaders(): string {
    if (this.infoRequest) {
      let tempHeaders: { [key: string]: any } = {};
      this.infoRequest.headers.forEach((header) => {
        tempHeaders[header.key] = header.value;
      });
      return JSON.stringify(tempHeaders);
    }
    return "";
  }

  getRawBody(): string {
    if (this.infoRequest) {
      let tempBody: { [key: string]: any } = {};
      this.infoRequest.body.forEach((body) => {
        tempBody[body.key] = this.getRawValue("body", body.value);
      });
      return JSON.stringify(tempBody);
    }
    return "";
  }

  getRawParams(): string {
    if (this.infoRequest) {
      let tempParams: { [key: string]: any } = {};
      this.infoRequest.params.forEach((param) => {
        tempParams[param.key] = param.value;
      });
      return JSON.stringify(tempParams, null, 2);
    }
    return "{}";
  }

  getRawValue(type: "params" | "headers" | "body", data: any | BodyValue): string {
    switch (type) {
      case "body":
        switch (data.type) {
          case "String":
            return data.value;
          case "Number":
            return String(data.value);
          case "Bool":
            return String(data.value);
          case "Array":
            return JSON.stringify(data.value);
          case "Object":
            return JSON.stringify(data.value);
          default:
            return "";
        }
      case "params":
      case "headers":
        return String(data);
      default:
        return "";
    }
  }

  parseHeader(event: any) {
    let rawData = JSON.parse(event.target.value);
    if (this.infoRequest) {
      this.infoRequest.headers = [];
      if (rawData) {
        const keys = Object.keys(rawData);
        keys.forEach((key) => {
          if (this.infoRequest) {
            this.infoRequest.headers.push({
              key,
              value: rawData[key],
              isActive: true,
            });
          }
        });
        this.infoRequest.headers.push({
          key: "",
          value: "",
          isActive: false,
        });
      }
    }
  }

  parseBody(event: any) {
    let rawData = JSON.parse(event.target.value);
    if (this.infoRequest) {
      this.infoRequest.body = [];
      if (rawData) {
        const keys = Object.keys(rawData);
        keys.forEach((key) => {
          if (this.infoRequest) {
            this.infoRequest.body.push({
              key,
              value: this.parseBodyValue(rawData[key]),
              isActive: true,
            });
          }
        });
        this.infoRequest.body.push({
          key: "",
          value: { type: "String", value: "" },
          isActive: false,
        });
      }
    }
  }

  parseParam(event: any) {
    let rawData = JSON.parse(event.target.value);
    if (this.infoRequest) {
      this.infoRequest.params = [];
      if (rawData) {
        const keys = Object.keys(rawData);
        keys.forEach((key) => {
          if (this.infoRequest) {
            this.infoRequest.params.push({
              key,
              value: rawData[key],
              isActive: true,
            });
          }
        });
        this.infoRequest.params.push({
          key: "",
          value: "",
          isActive: false,
        });
      }
    }
  }

  parseBodyValue(data: any): BodyValue {
    let tempObj: BodyValue = { type: "String", value: "" };
    if (Common.isJsonAsString(data)) {
      if (Array.isArray(JSON.parse(data))) {
        tempObj = {
          type: "Array",
          value: JSON.parse(data),
        } as BodyValue;
      } else if (!Array.isArray(JSON.parse(data)) && Common.isJsonAsString(data)) {
        tempObj = {
          type: "Object",
          value: JSON.parse(data),
        } as BodyValue;
      }
    } else if (Common.isJson(data)) {
      if (Array.isArray(data)) {
        tempObj = {
          type: "Array",
          value: data,
        } as BodyValue;
      } else if (!Array.isArray(data) && Common.isJson(data)) {
        tempObj = {
          type: "Object",
          value: data,
        } as BodyValue;
      }
    } else if (/true/i.test(data) || /false/i.test(data)) {
      tempObj = {
        type: "Bool",
        value: /true/i.test(data),
      } as BodyValue;
    } else if (Number(data)) {
      tempObj = {
        type: "Number",
        value: Number(data),
      } as BodyValue;
    } else {
      tempObj = {
        type: "String",
        value: data.toString(),
      } as BodyValue;
    }

    return tempObj;
  }

  addResponseToHistory(responseData: string, status: "success" | "error") {
    if (this.infoRequest) {
      if (!this.infoRequest.responses) {
        this.infoRequest.responses = [];
      }

      const responseItem: RequestResponse = {
        id: UUID(),
        timestamp: new Date(),
        data: responseData,
        status: status,
      };

      if (this.infoRequest.responses.length >= 10) {
        this.infoRequest.responses.shift();
      }

      this.infoRequest.responses.push(responseItem);
      this.saveData();
    }
  }

  sendRequest() {
    if (this.infoRequest) {
      this.urlRequestsService
        .sendRequest<string>(this.infoRequest)
        .then((response: Response<string>) => {
          this.selectedTabIndex = 3;
          this.notifyService.showNotify(response.status, response.message);
          if (response.status == ResponseStatus.SUCCESS) {
            this.response = response.data;
            this.addResponseToHistory(response.data, "success");
            setTimeout(() => {
              this.parseData$.next(this.response);
            }, 500);
          }
        })
        .catch((err: Response<string>) => {
          const errorMsg = err.message ?? err.toString();
          this.response = errorMsg;
          this.addResponseToHistory(errorMsg, "error");
          this.notifyService.showError(errorMsg);
          this.selectedTabIndex = 3;
        });
    }
  }

  getLatestResponse(): string {
    if (this.infoRequest && this.infoRequest.responses && this.infoRequest.responses.length > 0) {
      const latestResponse = this.infoRequest.responses[0];
      this.response = latestResponse.data;
      this.currentResponseId = latestResponse.id;
      return this.response;
    }
    this.currentResponseId = "";
    return this.response;
  }

  getResponseHistory(): RequestResponse[] {
    if (this.infoRequest && this.infoRequest.responses) {
      return this.infoRequest.responses.sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
      );
    }
    return [];
  }

  loadResponseFromHistory(response: RequestResponse) {
    this.response = response.data;
    this.currentResponseId = response.id;
    this.isResponseCollapsed = false;
    setTimeout(() => {
      this.parseData$.next(this.response);
    }, 500);
  }

  clearResponseHistory() {
    if (this.infoRequest) {
      this.infoRequest.responses = [];
      this.saveData();
      this.notifyService.showNotify(ResponseStatus.SUCCESS, "Response history cleared");
    }
  }

  getCurrentResponseMetadata() {
    if (this.infoRequest && this.infoRequest.responses) {
      const responseMeta = this.infoRequest.responses.find((r) => r.id === this.currentResponseId);
      if (responseMeta) {
        return responseMeta;
      }
    }

    if (this.infoRequest && this.infoRequest.responses && this.infoRequest.responses.length > 0) {
      return this.infoRequest.responses[0];
    }
    return null;
  }

  isViewingLatestResponse(): boolean {
    if (this.infoRequest && this.infoRequest.responses && this.infoRequest.responses.length > 0) {
      const latestResponse = this.infoRequest.responses[0];
      return this.currentResponseId === latestResponse.id || !this.currentResponseId;
    }
    return true;
  }

  toggleResponseCollapsed() {
    this.isResponseCollapsed = !this.isResponseCollapsed;

    if (!this.isResponseCollapsed && this.response) {
      setTimeout(() => {
        this.parseData$.next(this.response);
      }, 100);
    }
  }

  viewLatestResponse(event: any) {
    event.stopPropagation();
    this.getLatestResponse();
    this.isResponseCollapsed = false;
    setTimeout(() => {
      this.parseData$.next(this.response);
    }, 100);
  }

  getInfo(coll: Collection, req: Request) {
    this.infoCollection = coll;
    this.infoRequest = req;

    this.getLatestResponse();
  }

  saveData() {
    this.urlRequestsService
      .saveData<string>(this.listCollections)
      .then((data: Response<string>) => {
        this.notifyService.showNotify(data.status, data.message);
      })
      .catch((err: Response<string>) => {
        this.notifyService.showError(err.message ?? err.toString());
      });
  }

  isValuePresent(item: RecObj | BodyData, type: string): boolean {
    if (item.key === "") return false;
    if (type === "body") {
      return (item as BodyData).value.value !== "";
    } else {
      return (item as RecObj).value !== "";
    }
  }

  private undo() {
    if (this.undoStack.length > 0) {
      const item = this.undoStack.pop()!;
      switch (item.type) {
        case "url":
          const req = this.listCollections
            .flatMap((c) => c.requests)
            .find((r) => r.id === item.requestId);
          if (req) req.url = item.oldValue;
          break;
        case "param":
        case "header":
        case "body":
          if (this.infoRequest && item.index !== undefined && item.field) {
            (this.infoRequest as any)[item.type + "s"][item.index][item.field] = item.oldValue;
          }
          break;
        case "requestTitle":
          const rreq = this.listCollections
            .flatMap((c) => c.requests)
            .find((r) => r.id === item.requestId);
          if (rreq) rreq.title = item.oldValue;
          break;
        case "collectionTitle":
          const coll = this.listCollections.find((c) => c.id === item.collectionId);
          if (coll) coll.title = item.oldValue;
          break;
      }
    }
  }
}
