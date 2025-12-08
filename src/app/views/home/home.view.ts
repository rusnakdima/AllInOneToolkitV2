/* sys lib */
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";

/* materials */
import { MatIconModule } from "@angular/material/icon";

/* models */
import { Link } from "@models/link";

/* services */
import { RecentLinksService } from "@services/recent-links.service";

/* views */
import { CardItemView } from "@views/items/card-item/card-item.view";
import { TileItemView } from "@views/items/tile-item/tile-item.view";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, CardItemView, TileItemView],
  templateUrl: "./home.view.html",
})
export class HomeView implements OnInit {
  constructor(private recentLinksService: RecentLinksService) {}

  listRecentLinks: Array<Link> = [];

  typeViewList: string = "list";

  ngOnInit(): void {
    this.listRecentLinks = this.recentLinksService.getAllRecentLinks();
  }

  changeTypeView() {
    this.typeViewList = this.typeViewList === "list" ? "grid" : "list";
  }
}
