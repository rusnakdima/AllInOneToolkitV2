export enum TypeRequest {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DEL = "DEL",
}

export interface RecObj {
  key: string;
  value: any;
  isActive: boolean;
}

export interface BodyValue {
  type: "String" | "Number" | "Bool" | "Array" | "Object";
  value: any;
}

export interface BodyData {
  key: string;
  value: BodyValue;
  isActive: boolean;
}

export interface Request {
  id: string;
  title: string;
  editTitle: boolean;
  typeReq: TypeRequest;
  url: string;
  params: Array<RecObj>;
  headers: Array<RecObj>;
  body: Array<BodyData>;
}
