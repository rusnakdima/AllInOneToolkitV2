/* sys lib */
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Subject } from 'rxjs';

/* materials */
import { MatIconModule } from '@angular/material/icon';

/* components */
import { HeaderComponent } from "./views/shared/header/header.component";
import { NavComponent } from "./views/shared/nav/nav.component";
import { BottomNavComponent } from "./views/shared/bottom-nav/bottom-nav.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, MatIconModule, HeaderComponent, NavComponent, BottomNavComponent],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor() {}

  @Input() isShowNav: Subject<boolean> = new Subject();

  ngOnInit(): void {
    const theme = localStorage.getItem("theme") ?? "";
    document.querySelector("html")!.setAttribute("class", theme);
  }

  showNav(show: boolean): void {
    this.isShowNav.next(show);
  }
}
