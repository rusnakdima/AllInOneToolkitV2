/* sys lib */
import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Subject } from 'rxjs';

/* components */
import { INotify, WindowNotifyComponent } from '@views/shared/window-notify/window-notify.component';

@Component({
  selector: 'app-copy-field',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, WindowNotifyComponent],
  templateUrl: './copy-field.component.html'
})
export class CopyFieldComponent {
  constructor() {}

  dataNotify: Subject<INotify> = new Subject();

  @Input() value: string | Array<string> = '';

  copyData() {
    if (typeof(this.value) === 'string') {
      navigator.clipboard.writeText(this.value ?? "");
    } else if (Array.isArray(this.value) && this.value.length > 0) {
      navigator.clipboard.writeText(this.value.join("\n"));
    }
    this.dataNotify.next({
      status: "success",
      text: "Data copied successfully!"
    })
  }

  isArray() {
    return Array.isArray(this.value);
  }
}
