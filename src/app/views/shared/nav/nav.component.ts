/* system libraries */
import { CommonModule } from "@angular/common";
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  OnInit,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { Subject } from "rxjs";

/* materials */
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-nav",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: "./nav.component.html",
})
export class NavComponent implements OnInit {
  constructor() {}

  @Input() isShowNavEvent: Subject<boolean> = new Subject();

  showNav: boolean = false;

  ngOnInit(): void {
    this.isShowNavEvent.subscribe((value: boolean) => {
      this.showNav = value;
    });
  }
}
