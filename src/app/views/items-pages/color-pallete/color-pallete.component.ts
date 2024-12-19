/* sys lib */
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

/* materials */
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: "app-color-pallete",
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule],
  templateUrl: "./color-pallete.component.html",
})
export class ColorPalleteComponent {
  constructor() {}

  typeCol: string = "";
  dataField: string = "";
  colorOut: string = "";
  resRGB: string = "rgb(0, 0, 0)";
  resHEX: string = "#000000";
  resHSV: string = "hsv(0°, 0%, 0%)";

  setType(type: string) {
    this.typeCol = type;
  }

  changeColorOut(event: any) {
    this.dataField = event.target.value;
    this.hexToRGB();
  }

  convertColor(event: any) {
    this.dataField = event.target.value;
    if (this.typeCol != "") {
      if (this.typeCol == "rgb") {
        this.rgbToHEX();
      } else if (this.typeCol == "hex") {
        this.hexToRGB();
      } else if (this.typeCol == "hsv") {
        this.hsvToRGB();
      } else {
        alert("Please select a type color");
      }
    }
  }

  hexToRGB() {
    const hex = this.dataField.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    this.resHEX = this.dataField;
    this.resRGB = `rgb(${r}, ${g}, ${b})`;
    this.rgbToHSV(r, g, b);
  }

  rgbToHEX() {
    const data = this.dataField.match(/^rgb\((\d+),*\s*(\d+),*\s*(\d+)\);*$/);
    if (data != null) {
      let r = parseInt(data[1]);
      let g = parseInt(data[2]);
      let b = parseInt(data[3]);
      const hexR = r.toString(16).padStart(2, "0");
      const hexG = g.toString(16).padStart(2, "0");
      const hexB = b.toString(16).padStart(2, "0");
      const hexValue = `#${hexR}${hexG}${hexB}`;
      this.resHEX = hexValue;
      this.resRGB = this.dataField;
      this.rgbToHSV(r, g, b);
    }
  }

  rgbToHSV(r: number, g: number, b: number) {
    r = r / 255.0;
    g = g / 255.0;
    b = b / 255.0;

    const cmax = Math.max(r, Math.max(g, b));
    const cmin = Math.min(r, Math.min(g, b));
    const diff = cmax - cmin;
    let h = -1,
      s = -1,
      v = cmax * 100;

    if (cmax == cmin) h = 0;
    else if (cmax == r) h = (60 * ((g - b) / diff) + 360) % 360;
    else if (cmax == g) h = (60 * ((b - r) / diff) + 120) % 360;
    else if (cmax == b) h = (60 * ((r - g) / diff) + 240) % 360;

    if (cmax == 0) s = 0;
    else s = (diff / cmax) * 100;

    this.resHSV = `hsv(${h.toFixed(0)}°, ${s.toFixed(0)}%, ${v.toFixed(0)}%)`;
  }

  hsvToRGB() {
    const data = this.dataField.match(
      /^hsv\((\d+)°?,*\s*(\d+)%?,*\s*(\d+)%?\);*$/
    );
    if (data != null) {
      let h = parseFloat(data[1]),
        s = parseFloat(data[2]),
        v = parseFloat(data[3]);

      if (h < 0) h = 0;
      if (s < 0) s = 0;
      if (v < 0) v = 0;
      if (h >= 360) h = 359;
      if (s > 100) s = 100;
      if (v > 100) v = 100;
      s /= 100.0;
      v /= 100.0;

      const c = v * s;
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
      const m = v - c;

      let r = 0,
        g = 0,
        b = 0;
      if (h >= 0 && h < 60) {
        [r, g, b] = [c, x, 0];
      } else if (h >= 60 && h < 120) {
        [r, g, b] = [x, c, 0];
      } else if (h >= 120 && h < 180) {
        [r, g, b] = [0, c, x];
      } else if (h >= 180 && h < 240) {
        [r, g, b] = [0, x, c];
      } else if (h >= 240 && h < 300) {
        [r, g, b] = [x, 0, c];
      } else if (h >= 300 && h < 360) {
        [r, g, b] = [c, 0, x];
      } else {
        [r, g, b] = [0, 0, 0];
      }

      r = Math.round((r + m) * 255);
      g = Math.round((g + m) * 255);
      b = Math.round((b + m) * 255);

      this.dataField = `rgb(${r}, ${g}, ${b})`;
      this.rgbToHEX();
    }
  }
}
