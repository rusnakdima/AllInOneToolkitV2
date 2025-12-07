export interface UndoItem {
  type: "url" | "param" | "header" | "body" | "requestTitle" | "collectionTitle";
  oldValue: any;
  newValue: any;
  index?: number;
  field?: "key" | "value";
  requestId?: string;
  collectionId?: string;
}
