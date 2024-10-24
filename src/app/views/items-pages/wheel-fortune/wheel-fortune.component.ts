/* system libraries */
import { CommonModule } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from "@angular/core";

@Component({
  selector: "app-wheel-fortune",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule],
  templateUrl: "./wheel-fortune.component.html",
})
export class WheelFortuneComponent implements OnInit {
  constructor() {}

  listColorsEntries: Array<string> = [
    "red",
    "orange",
    "yellow",
    "green",
    "cyan",
    "blue",
    "purple",
  ];
  listEntries: Array<string> = [
    "Fortune 1",
    "Fortune 2",
    "Fortune 3",
    "Fortune 4",
    "Fortune 5",
    "Fortune 6",
    "Fortune 7",
  ];

  outputListEntries: Array<string> = [];

  currentAngle: number = 0;
  segmentAngle = (Math.PI * 2) / this.listEntries.length;
  wheelRadius: number = 0;

  rotationAngle: number = 0;
  spinSpeed: number = 2;
  deceleration: number = 0.1;

  typeWinner: string = "first";

  winningEntry: string = "";

  isSpinning: boolean = false;
  isShowPanel: boolean = false;

  ngOnInit() {
    document.addEventListener("keyup", (event: any) => {
      if (event.ctrlKey && event.key === "Enter") {
        this.startSpin();
      }
    });

    setInterval(() => {
      if (document.body.clientWidth >= 768) {
        this.isShowPanel = true;
      }
    }, 500);

    const wheel = document.getElementById("wheel") as HTMLCanvasElement;
    if (wheel) {
      const ctx = wheel.getContext("2d");
      if (ctx) {
        this.segmentAngle = (Math.PI * 2) / this.listEntries.length;
        this.wheelRadius = wheel.width / 2;
        ctx.clearRect(0, 0, this.wheelRadius, this.wheelRadius);
        this.currentAngle = 0;

        this.drawWheel(ctx);
      }
    }
  }

  getListEntries(): string {
    return this.listEntries.join("\r\n");
  }

  changeFieldEntries(event: any) {
    event.preventDefault();
    this.listEntries = event.target.value.split("\n");
    this.listEntries = this.listEntries.filter(entry => entry != "");
    if (this.listEntries.length == 0) {
      this.listEntries.push(" ");
    }

    const wheel = document.getElementById("wheel") as HTMLCanvasElement;
    if (wheel) {
      const ctx = wheel.getContext("2d");
      if (ctx) {
        this.segmentAngle = (Math.PI * 2) / ((this.listEntries.length > 0) ? this.listEntries.length : 1) /* this.listEntries.length */;
        this.wheelRadius = wheel.width / 2;
        ctx.clearRect(0, 0, this.wheelRadius, this.wheelRadius);

        this.drawWheel(ctx);
      }
    }
  }

  drawWheel(ctx: CanvasRenderingContext2D) {
    this.listEntries.forEach((entry, i) => {
      ctx.beginPath();
      ctx.moveTo(this.wheelRadius, this.wheelRadius);
      ctx.arc(
        this.wheelRadius,
        this.wheelRadius,
        this.wheelRadius,
        this.currentAngle,
        this.currentAngle + this.segmentAngle
      );
      ctx.fillStyle = this.listColorsEntries[i % this.listColorsEntries.length];
      ctx.fill();
      ctx.closePath();
      this.drawText(ctx, entry, i);

      this.currentAngle += this.segmentAngle;
    });
  }

  drawText(ctx: CanvasRenderingContext2D, text: string, i: number) {
    ctx.save();
    ctx.translate(this.wheelRadius, this.wheelRadius);
    ctx.rotate(this.currentAngle + this.segmentAngle / 2);

    let tempI = i % this.listColorsEntries.length;
    ctx.fillStyle =
      tempI == 0 || tempI == 3 || tempI == 5 || tempI == 6 ? "white" : "black";

    ctx.font = "bold 1rem Arial";
    ctx.textBaseline = "middle";

    ctx.fillText(text, this.wheelRadius - 100, 0);
    ctx.restore();
  }

  getWinningSegment() {
    const normalizedAngle =
      (2 * Math.PI - (this.currentAngle % (2 * Math.PI))) % (2 * Math.PI);
    const winningIndex = Math.floor(normalizedAngle / this.segmentAngle);
    return this.listEntries[winningIndex];
  }

  easeOutQuad(t: number) {
    return t * (2 - t);
  }

  async startSpin() {
    if (this.typeWinner == "first") {
      this.spinWheel();
    } else if (this.typeWinner == "last") {
      while (this.listEntries.length > 1) {
        this.spinWheel();
        await new Promise((resolve) => setTimeout(resolve, 4200));
        if (this.winningEntry != "") {
          this.listEntries.splice(
            this.listEntries.indexOf(this.winningEntry),
            1
          );
          this.winningEntry = "";
          if (this.typeWinner == "last" && this.listEntries.length == 1) {
            this.winningEntry = this.listEntries[0];
          }
          const wheel = document.getElementById("wheel") as HTMLCanvasElement;
          if (wheel) {
            const ctx = wheel.getContext("2d");
            if (ctx) {
              this.segmentAngle = (Math.PI * 2) / this.listEntries.length;
              this.wheelRadius = wheel.width / 2;
              ctx.clearRect(0, 0, this.wheelRadius, this.wheelRadius);

              this.drawWheel(ctx);
            }
          }
        }
      }
    }
  }

  spinWheel() {
    if (this.isSpinning) return;
    this.isSpinning = true;

    const wheel = document.getElementById("wheel") as HTMLCanvasElement;
    if (wheel) {
      const ctx = wheel.getContext("2d");
      if (ctx) {
        const totalDuration = 4000;
        const accelerationDuration = 700;
        const decelerationDuration = 2000;
        const steadyDuration =
          totalDuration - accelerationDuration - decelerationDuration;

        let initialSpinAngle: number = Math.random() * 300 + 50;
        let start: any | null = null;

        const animate = (timestamp: any) => {
          if (!start) start = timestamp;
          let elapsed = timestamp - start;

          if (elapsed < accelerationDuration) {
            let t = elapsed / accelerationDuration;
            this.currentAngle +=
              (initialSpinAngle * this.easeOutQuad(t)) / accelerationDuration;
          } else if (elapsed < totalDuration) {
            let t =
              (elapsed - accelerationDuration - steadyDuration) /
              decelerationDuration;
            this.currentAngle +=
              (initialSpinAngle * (1 - this.easeOutQuad(t))) /
              decelerationDuration;
          } else {
            this.currentAngle = this.currentAngle % (2 * Math.PI);
            this.isSpinning = false;
            this.winningEntry = this.getWinningSegment();
            return;
          }

          ctx.clearRect(0, 0, wheel.width, wheel.height);
          this.drawWheel(ctx);
          requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
      }
    }
  }
}
