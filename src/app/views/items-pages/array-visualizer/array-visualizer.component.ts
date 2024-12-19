/* sys lib */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-array-visualizer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './array-visualizer.component.html'
})
export class ArrayVisualizerComponent {
  constructor() {}

  dataArray: Array<any> = []

  executeCode(event: any) {
    let data = event.target.value;
    setTimeout(() => {
      try {
        data += "\nreturn array;"
        const result = new Function(data)();
        // console.log(result)
        this.dataArray = result;
      } catch (error) {
        console.error(error);
      }
    }, 1500);
  }
}
