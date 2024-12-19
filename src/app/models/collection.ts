import { Request } from "./request";

export interface Collection {
  id: string;
  title: string;
  editTitle: boolean;
  requests: Array<Request>;
}
