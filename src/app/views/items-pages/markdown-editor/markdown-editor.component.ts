/* sys lib */
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

/* components */
import { FileInputComponent } from "@shared/fields/file-input/file-input.component";

@Component({
  selector: "app-markdown-editor",
  standalone: true,
  imports: [CommonModule, FileInputComponent],
  templateUrl: "./markdown-editor.component.html",
})
export class MarkdownEditorComponent {
  constructor() {}

  typeFile: Array<string> = ["md"];
  mdData: string = "";
  dataField: string = "";

  mdPrevData: string = "";

  setDataFile(dataFile: any) {
    this.mdData = dataFile;
  }

  parseFile() {
    this.dataField = this.mdData;
    this.convertData();
  }

  parseField(event: any) {
    this.dataField = event.target.value;
    this.convertData();
  }

  convertData() {
    this.mdPrevData = this.parseData(this.dataField);
  }

  parseData(text: string) {
    let htmlRaw = "";
    let tempText = text;

    const supReg = new RegExp(`\\^([^\\^\\n]+)\\^`);
    const sup = tempText.match(new RegExp(supReg.source, "g"));
    if (sup && sup.length > 0) {
      sup.forEach((val: string) => {
        const dataReg = supReg.exec(val);
        if (dataReg) {
          tempText = tempText.replace(dataReg[0], `<sup>${dataReg[1]}</sup>`);
        }
      });
    }

    const subReg = new RegExp(`\\~([^\\~\\n]+)\\~`);
    const sub = tempText.match(new RegExp(subReg.source, "g"));
    if (sub && sub.length > 0) {
      sub.forEach((val: string) => {
        const dataReg = subReg.exec(val);
        if (dataReg) {
          tempText = tempText.replace(dataReg[0], `<sub>${dataReg[1]}</sub>`);
        }
      });
    }

    const boldReg = new RegExp(`\\*\{2\}([^\\*\\n]+)\\*\{2\}`);
    const bold = tempText.match(new RegExp(boldReg.source, "g"));
    if (bold && bold.length > 0) {
      bold.forEach((val: string) => {
        const dataReg = boldReg.exec(val);
        if (dataReg) {
          tempText = tempText.replace(dataReg[0], `<b>${dataReg[1]}</b>`);
        }
      });
    }

    const italicReg = new RegExp(`\\*([^\\*\\n]+)\\*`);
    const italic = tempText.match(new RegExp(italicReg.source, "g"));
    if (italic && italic.length > 0) {
      italic.forEach((val: string) => {
        const dataReg = italicReg.exec(val);
        if (dataReg) {
          tempText = tempText.replace(dataReg[0], `<i>${dataReg[1]}</i>`);
        }
      });
    }

    const italicAltReg = new RegExp(`\\_([^\\_\\n]+)\\_`);
    const italicAlt = tempText.match(new RegExp(italicAltReg.source, "g"));
    if (italicAlt && italicAlt.length > 0) {
      italicAlt.forEach((val: string) => {
        const dataReg = italicAltReg.exec(val);
        if (dataReg) {
          tempText = tempText.replace(dataReg[0], `<i>${dataReg[1]}</i>`);
        }
      });
    }

    const linkReg = new RegExp(`\\[(.+)\\]\\((.+)\\)`);
    const link = tempText.match(new RegExp(linkReg.source, "g"));
    if (link && link.length > 0) {
      link.forEach((val: string) => {
        const dataReg = linkReg.exec(val);
        if (dataReg) {
          tempText = tempText.replace(
            dataReg[0],
            `<a class="styleLink" href="${dataReg[2]}" title="${dataReg[2]}">${dataReg[1]}</a>`
          );
        }
      });
    }

    const codeReg = /\n*\`{3}\w*?\n([\s\S]*?)\n\`{3}\n*/;
    const code = tempText.match(new RegExp(codeReg.source, "g"));
    if (code && code.length > 0) {
      code.forEach((val: string) => {
        const dataReg = codeReg.exec(val);
        if (dataReg) {
          tempText = tempText.replace(
            dataReg[0],
            `<pre><code>${dataReg[1]}</code></pre>`
          );
        }
      });
    }

    const listBlockReg = new RegExp(`^((\\ *[-*])\\ *.+\\n?)+\\n?$`);
    const listBlocks = tempText.match(new RegExp(listBlockReg.source, "gm"));
    if (listBlocks && listBlocks.length > 0) {
      listBlocks.forEach((block: string) => {
        const dataRegBlock = listBlockReg.exec(block);
        if (dataRegBlock) {
          const listReg = new RegExp(`^(\\ *)([-*])\\ *(.+)$`);
          const list = block.match(new RegExp(listReg.source, "gm"));
          let li = "";
          if (list && list.length > 0) {
            list.forEach((val: string) => {
              const dataReg = listReg.exec(val);
              if (dataReg) {
                li += `<li class='${dataReg[1].length >= 2 ? "ml-4" : ""}'>${
                  dataReg[3]
                }</li>`;
              }
            });
          }
          const ul = `<ul class="list-disc list-inside">${li}</ul>`;
          tempText = tempText.replace(dataRegBlock[0], ul);
        }
      });
    }

    const listNumericBlockReg = new RegExp(`^((\\ *\\d\\.)\\ *.+\\n?)+\\n?$`);
    const listNumericBlocks = tempText.match(
      new RegExp(listNumericBlockReg.source, "gm")
    );
    if (listNumericBlocks && listNumericBlocks.length > 0) {
      listNumericBlocks.forEach((block: string) => {
        const dataRegBlock = listNumericBlockReg.exec(block);
        if (dataRegBlock) {
          const listNumericReg = new RegExp(`^(\\ *)(\\d\\.)\\ *(.+)$`);
          const listNumeric = block.match(
            new RegExp(listNumericReg.source, "gm")
          );
          let li = "";
          if (listNumeric && listNumeric.length > 0) {
            listNumeric.forEach((val: string) => {
              const dataReg = listNumericReg.exec(val);
              if (dataReg) {
                li += `<li class='${dataReg[1].length >= 2 ? "ml-4" : ""}'>${
                  dataReg[3]
                }</li>`;
              }
            });
          }
          const ul = `<ol class="list-decimal list-inside">${li}</ol>`;
          tempText = tempText.replace(dataRegBlock[0], ul);
        }
      });
    }

    const h6Reg = new RegExp(`^\\ *#\{6\}\\s(.+)\\n?$`);
    const h6 = tempText.match(new RegExp(h6Reg.source, "gm"));
    if (h6 && h6.length > 0) {
      h6.forEach((val: string) => {
        const dataReg = h6Reg.exec(val);
        if (dataReg) {
          tempText = tempText.replace(
            dataReg[0],
            `<p class='font-bold text-[1rem]'>${dataReg[1]}</p>`
          );
        }
      });
    }

    const h5Reg = new RegExp(`^\\ *#\{5\}\\s(.+)\\n?$`);
    const h5 = tempText.match(new RegExp(h5Reg.source, "gm"));
    if (h5 && h5.length > 0) {
      h5.forEach((val: string) => {
        const dataReg = h5Reg.exec(val);
        if (dataReg) {
          tempText = tempText.replace(
            dataReg[0],
            `<p class='font-bold text-[1.125rem]'>${dataReg[1]}</p>`
          );
        }
      });
    }

    const h4Reg = new RegExp(`^\\ *#\{4\}\\s(.+)\\n?$`);
    const h4 = tempText.match(new RegExp(h4Reg.source, "gm"));
    if (h4 && h4.length > 0) {
      h4.forEach((val: string) => {
        const dataReg = h4Reg.exec(val);
        if (dataReg) {
          tempText = tempText.replace(
            dataReg[0],
            `<p class='font-bold text-[1.25rem]'>${dataReg[1]}</p>`
          );
        }
      });
    }

    const h3Reg = new RegExp(`^\\ *#\{3\}\\s(.+)\\n?$`);
    const h3 = tempText.match(new RegExp(h3Reg.source, "gm"));
    if (h3 && h3.length > 0) {
      h3.forEach((val: string) => {
        const dataReg = h3Reg.exec(val);
        if (dataReg) {
          tempText = tempText.replace(
            dataReg[0],
            `<p class='font-bold text-[1.5rem]'>${dataReg[1]}</p>`
          );
        }
      });
    }

    const h2Reg = new RegExp(`^\\ *#\{2\}\\s(.+)\\n?$`);
    const h2 = tempText.match(new RegExp(h2Reg.source, "gm"));
    if (h2 && h2.length > 0) {
      h2.forEach((val: string) => {
        const dataReg = h2Reg.exec(val);
        if (dataReg) {
          tempText = tempText.replace(
            dataReg[0],
            `<p class='font-bold text-[1.875rem]'>${dataReg[1]}</p>`
          );
        }
      });
    }

    const h1Reg = new RegExp(`^\\ *#\{1\}\\s(.+)\\n?$`);
    const h1 = tempText.match(new RegExp(h1Reg.source, "gm"));
    if (h1 && h1.length > 0) {
      h1.forEach((val: string) => {
        const dataReg = h1Reg.exec(val);
        if (dataReg) {
          tempText = tempText.replace(
            dataReg[0],
            `<p class='font-bold text-[2.125rem]'>${dataReg[1]}</p>`
          );
        }
      });
    }

    const backticksReg = new RegExp(`\`([^\\\`\\n]+)\``);
    const backticks = tempText.match(new RegExp(backticksReg.source, "g"));
    if (backticks && backticks.length > 0) {
      backticks.forEach((val: string) => {
        const dataReg = backticksReg.exec(val);
        if (dataReg) {
          tempText = tempText.replace(
            dataReg[0],
            `<span class='bg-gray-500 dark:bg-gray-600'>${dataReg[1]}</span>`
          );
        }
      });
    }

    const paragraphReg = new RegExp(`^(.+)\\n?$`);
    const paragraph = tempText.match(new RegExp(paragraphReg.source, "gm"));
    if (paragraph && paragraph.length > 0) {
      paragraph.forEach((val: string) => {
        const dataReg = paragraphReg.exec(val);
        if (dataReg) {
          tempText = tempText.replace(dataReg[0], `<p>${dataReg[1]}</p>`);
        }
      });
    }

    const brReg = /\n/;
    const br = tempText.match(new RegExp(brReg.source, "g"));
    if (br && br.length > 0) {
      br.forEach((val: string) => {
        const dataReg = brReg.exec(val);
        if (dataReg) {
          tempText = tempText.replace(dataReg[0], `<br />`);
        }
      });
    }

    htmlRaw = tempText;
    return htmlRaw;
  }
}
