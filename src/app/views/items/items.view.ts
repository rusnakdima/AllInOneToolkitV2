/* sys lib */
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";

/* materials */
import { MatIconModule } from "@angular/material/icon";

/* models */
import { Link } from "@models/link";

/* services */
import { LinksService } from "@services/links.service";

/* components */
import { SearchComponent } from "@components/fields/search/search.component";

/* views */
import { TileItemView } from "./tile-item/tile-item.view";
import { CardItemView } from "./card-item/card-item.view";

@Component({
  selector: "app-items",
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, SearchComponent, TileItemView, CardItemView],
  templateUrl: "./items.view.html",
})
export class ItemsView implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private linksService: LinksService
  ) {}

  tempListLinks: Array<Link> = [];
  listLinks: Array<Link> = [];

  catalogId: string = "";

  typeViewList: string = "list";

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.catalogId = params["id"];
        this.refresh();
      }
    });
  }

  refresh() {
    let elem = document.querySelector("#refreshBut") as HTMLElement;
    if (elem != null) {
      elem.classList.add("animate-spin");
      setTimeout(() => {
        elem.classList.remove("animate-spin");
      }, 2000);
    }

    this.tempListLinks = this.linksService.getLinksByCatalog(this.catalogId);
    this.listLinks = this.tempListLinks.slice();
  }

  searchFunc(arr: Array<any>) {
    this.listLinks = arr;
  }

  changeTypeView() {
    this.typeViewList = this.typeViewList === "list" ? "grid" : "list";
  }
}
