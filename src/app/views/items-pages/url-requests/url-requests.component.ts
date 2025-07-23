/* sys lib */
import { CommonModule } from "@angular/common";
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  HostListener,
  OnInit,
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { v4 as UUID } from "uuid";

/* material */
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatSelectModule } from "@angular/material/select";
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";

/* helpers */
import { Common } from "@helpers/common";

/* models */
import { Response, ResponseStatus } from "@models/response";
import { Collection } from "@models/collection";
import {
  BodyData,
  BodyValue,
  RecObj,
  Request,
  TypeRequest,
} from "@models/request";

/* services */
import { UrlRequestsService } from "@services/url-requests.service";
import { NotifyService } from "@services/notify.service";
import { JsonParserComponent } from "@shared/json-parser/json-parser.component";

@Component({
  selector: "app-url-requests",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
    JsonParserComponent
],
  templateUrl: "./url-requests.component.html",
})
export class UrlRequestsComponent implements OnInit {
  constructor(
    private urlRequestsService: UrlRequestsService,
    private notifyService: NotifyService,
  ) {}

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
  typeEditorData: { headers: "table" | "json"; body: "table" | "json" } = {
    headers: "table",
    body: "table",
  };

  prevTitleCollection: string = "";
  prevTitleRequest: string = "";

  infoCollection: Collection | null = null;
  infoRequest: Request | null = null;

  editingObj: RecObj | BodyData | null = null;
  editingCol: string = "";
  editingRow: number = -1;

  selectedTabIndex: number = 0;
  response: string = "";

  isShowSidebar: boolean = false;

  isJsonAsString = Common.isJsonAsString;

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

    this.widthRightSidebar = window.innerWidth - 300;
    setInterval(() => {
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
      .getData()
      .then((data: Response) => {
        if (data.status == ResponseStatus.SUCCESS) {
          this.savedListCollections = data.data;
          this.listCollections = this.savedListCollections;
        } else {
          this.notifyService.showError("Failed to load data");
        }
      })
      .catch((err) => {
        console.error(err);
        this.notifyService.showError(err);
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
        return (
          JSON.stringify(savedRequest()) == JSON.stringify(this.infoRequest)
        );
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
    event.preventDefault();
    coll.editTitle = false;
    coll.title = this.prevTitleCollection;
    this.prevTitleCollection = "";

    this.saveData();
  }

  cancelRenameCollection(event: any, coll: Collection) {
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
        { key: "Accept-Encoding", value: "gzip, deflate, br", isActive: true },
        { key: "Content-Type", value: "application/json", isActive: true },
        { key: "Connection", value: "keep-alive", isActive: true },
        {
          key: "User-Agent",
          value: "PostmanRuntime/7.43.0",
          isActive: true,
        },
        { key: "", value: "", isActive: false },
      ],
      body: [
        { key: "", value: { type: "String", value: "" }, isActive: false },
      ],
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

  selAll(event: any, typeObj: "params" | "headers" | "body") {
    if (this.infoRequest) {
      this.infoRequest[typeObj].forEach(
        (rec) => (rec.isActive = event.target.checked),
      );
    }
  }

  getInfo(coll: Collection, req: Request) {
    this.infoCollection = coll;
    this.infoRequest = req;
    this.response = "";
  }

  inputChange(
    event: any,
    row: number,
    typeObj: "params" | "headers" | "body",
    field: "key" | "value",
  ) {
    if (this.editingObj) {
      if (field == "value" && typeObj == "body") {
        this.editingObj[field] = this.parseBodyValue(event.target.value);
      } else {
        this.editingObj[field] = event.target.value;
      }

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
      const url = new URL(this.infoRequest.url);
      if (url.search != "" && url.search.indexOf("?") == 0) {
        const params = url.search.slice(url.search.indexOf("?") + 1).split("&");
        params.forEach((param: string) => {
          const [key, value] = param.split("=");
          if (this.infoRequest) {
            if (
              this.infoRequest.params.findIndex(
                (param: RecObj) => param.key == key,
              ) == -1
            ) {
              this.infoRequest.params.push({
                key,
                value,
                isActive: true,
              });
            }
          }
        });
      }
    }

    if (this.infoRequest?.params.findIndex((rec) => rec.key == "") != -1) {
      this.infoRequest?.params.splice(
        this.infoRequest?.params.findIndex((rec) => rec.key == ""),
        1,
      );
      this.createObj("params");
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

  getRawValue(
    type: "params" | "headers" | "body",
    data: any | BodyValue,
  ): string {
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

  parseBodyValue(data: any): BodyValue {
    let tempObj: BodyValue = { type: "String", value: "" };
    if (Common.isJsonAsString(data)) {
      if (Array.isArray(JSON.parse(data))) {
        tempObj = {
          type: "Array",
          value: JSON.parse(data),
        } as BodyValue;
      } else if (
        !Array.isArray(JSON.parse(data)) &&
        Common.isJsonAsString(data)
      ) {
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

  sendRequest() {
    if (this.infoRequest) {
      this.urlRequestsService
        .sendRequest(this.infoRequest)
        .then((data: Response) => {
          this.selectedTabIndex = 3;
          this.notifyService.showNotify(data.status, data.message);
          if (data.status == ResponseStatus.SUCCESS) {
            if (Common.isJson(data.data)) {
              this.response = JSON.stringify(data.data);
            } else {
              this.response = data.data;
            }
          }
        })
        .catch((err) => {
          console.error(err);
          this.notifyService.showError(err);
        });
    }
  }

  saveData() {
    this.urlRequestsService
      .saveData(this.listCollections)
      .then((data: Response) => {
        this.notifyService.showNotify(data.status, data.message);
      })
      .catch((err) => {
        console.error(err);
        this.notifyService.showError(err);
      });
  }
}
