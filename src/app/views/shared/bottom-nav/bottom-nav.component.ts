/* sys lib */
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { filter } from "rxjs";

/* materials */
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-bottom-nav",
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: "./bottom-nav.component.html",
})
export class BottomNavComponent implements OnInit {
  constructor(private router: Router) {}

  url: string = "";

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((val) => {
        let tempURL = this.router.url.split("/")[1];
        tempURL =
          tempURL.indexOf("?") > -1
            ? tempURL.substring(0, tempURL.indexOf("?"))
            : tempURL;
        this.url = tempURL;
      });
  }
}
