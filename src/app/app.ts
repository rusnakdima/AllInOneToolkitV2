/* sys lib */
import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, RouterOutlet } from "@angular/router";
import { Subject } from "rxjs";

/* components */
import { HeaderComponent } from "@components/header/header.component";
import { NavComponent } from "@components/nav/nav.component";
import { BottomNavComponent } from "@components/bottom-nav/bottom-nav.component";
import { WindowNotifyComponent } from "@components/window-notify/window-notify.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    HeaderComponent,
    NavComponent,
    BottomNavComponent,
    WindowNotifyComponent,
  ],
  templateUrl: "./app.html",
})
export class App implements OnInit {
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
