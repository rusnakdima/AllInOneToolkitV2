/* sys lib */
import { CommonModule } from "@angular/common";
import { Component, ElementRef, ViewChild, AfterViewInit, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";

/* materials */
import { MatIconModule } from "@angular/material/icon";

import Chart from "chart.js/auto";

@Component({
  selector: "app-pie-chart",
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: "./pie-chart.view.html",
})
export class PieChartView implements OnInit, AfterViewInit {
  @ViewChild("pieChartCanvas", { static: true }) pieChartCanvas!: ElementRef<HTMLCanvasElement>;

  labels = signal<string[]>(["Initial Data"]);
  dataPoints = signal<number[]>([100]);
  colors = signal<string[]>(["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"]);

  labelInput = "";
  valueInput = 0;

  editIndex = signal<number | null>(null);

  chart!: Chart;
  legendColor = signal("#000000");

  ngOnInit() {
    this.legendColor.set(this.getLegendColor());
    const observer = new MutationObserver(() => {
      this.legendColor.set(this.getLegendColor());
      if (this.chart) {
        this.chart.options.plugins!.legend!.labels!.color = this.legendColor();
        this.chart.update();
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  }

  getLegendColor(): string {
    return document.documentElement.classList.contains("dark") ? "#ffffff" : "#000000";
  }

  ngAfterViewInit() {
    this.initializeChart();
  }

  initializeChart() {
    const ctx = this.pieChartCanvas.nativeElement.getContext("2d")!;
    this.chart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: this.labels(),
        datasets: [
          {
            data: this.dataPoints(),
            backgroundColor: this.colors(),
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: this.legendColor(),
            },
          },
        },
      },
    });
  }

  updateChart() {
    this.chart.data.labels = this.labels();
    this.chart.data.datasets[0].data = this.dataPoints();
    this.chart.update();
  }

  onSubmit() {
    if (!this.labelInput.trim()) return;

    if (this.editIndex() !== null) {
      // Update existing
      this.labels.update((labels) =>
        labels.map((l, i) => (i === this.editIndex() ? this.labelInput : l))
      );
      this.dataPoints.update((data) =>
        data.map((d, i) => (i === this.editIndex() ? this.valueInput : d))
      );
      this.editIndex.set(null);
    } else {
      // Add new
      if (this.labels()[0] === "Initial Data") {
        this.labels.set([]);
        this.dataPoints.set([]);
      }
      this.labels.update((labels) => [...labels, this.labelInput]);
      this.dataPoints.update((data) => [...data, this.valueInput]);
    }

    this.updateChart();

    this.labelInput = "";
    this.valueInput = 0;
  }

  editSegment(index: number) {
    this.editIndex.set(index);
    this.labelInput = this.labels()[index];
    this.valueInput = this.dataPoints()[index];
  }

  deleteSegment(index: number) {
    this.labels.update((labels) => labels.filter((_, i) => i !== index));
    this.dataPoints.update((data) => data.filter((_, i) => i !== index));
    this.updateChart();
  }
}
