/* sys lib */
import { CommonModule } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Subject } from "rxjs";

/* models */
import { Link } from "@models/link";

/* services */
import { RecentLinksService } from "@services/recent-links.service";

/* components */
import { CardItemComponent } from "@views/items/card-item/card-item.component";
import { TileItemComponent } from "@views/items/tile-item/tile-item.component";
import {
  INotify,
  WindowNotifyComponent,
} from "@views/shared/window-notify/window-notify.component";

@Component({
  selector: "app-home",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    RouterModule,
    CardItemComponent,
    TileItemComponent,
    WindowNotifyComponent,
  ],
  templateUrl: "./home.component.html",
})
export class HomeComponent implements OnInit {
  constructor(private recentLinksService: RecentLinksService) {}

  dataNotify: Subject<INotify> = new Subject();

  listRecentLinks: Array<Link> = [];

  typeViewList: string = "list";

  ngOnInit(): void {
    this.listRecentLinks = this.recentLinksService.getAllRecentLinks();
  }

  changeTypeView() {
    this.typeViewList = this.typeViewList === "list" ? "grid" : "list";
  }
}
