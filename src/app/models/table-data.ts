export interface TableData {
  thead: string[];
  tbody: (string | TableData)[][];
}

export const listColorsTable: Array<string> = [
  "!bg-[#FF6666] dark:!bg-[#660000]",
  "!bg-[#FF9966] dark:!bg-[#663300]",
  "!bg-[#FFFF99] dark:!bg-[#666600]",
  "!bg-[#99FF99] dark:!bg-[#006600]",
  "!bg-[#66CCFF] dark:!bg-[#003366]",
  "!bg-[#9999FF] dark:!bg-[#330066]",
  "!bg-[#CC99FF] dark:!bg-[#660066]",
];
