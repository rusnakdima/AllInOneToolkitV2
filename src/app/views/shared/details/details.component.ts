/* sys lib */
import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';

interface HeadData {
  key: string;
  type: string;
  value: string;
  padLeft: number;
  open: boolean;
}

interface ItemData {
  key: string;
  type: string;
  value: string;
  padLeft: number;
}

interface DetailsData {
  head: HeadData;
  list: (HeadData & {head?: undefined} | ItemData & {head?: undefined} | DetailsData)[];
}

@Component({
  selector: 'app-details',
  standalone: true,
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  imports: [CommonModule],
  templateUrl: './details.component.html'
})
export class DetailsComponent {
  constructor() {}

  @Input() dataDetails: DetailsData | any = { head: {"key": "", "type": "", "value": "", "padLeft": 0, "open": false}, list: [] };

  ngOnInit(): void {}

  toggleDetails() {
    this.dataDetails.head.open = !this.dataDetails.head.open;
  }
}
