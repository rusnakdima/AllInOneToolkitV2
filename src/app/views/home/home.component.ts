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

/* components */
import { CardItemComponent } from "@views/items/card-item/card-item.component";
import { TileItemComponent } from "@views/items/tile-item/tile-item.component";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, CardItemComponent, TileItemComponent],
  templateUrl: "./home.component.html",
})
export class HomeComponent implements OnInit {
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
