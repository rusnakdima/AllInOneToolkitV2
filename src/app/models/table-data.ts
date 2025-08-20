export interface TableData {
  thead: string[];
  tbody: (string | TableData)[][];
}
