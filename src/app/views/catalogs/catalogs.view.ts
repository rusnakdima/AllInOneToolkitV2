/* sys lib */
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";

/* materials */
import { MatIconModule } from "@angular/material/icon";

/* models */
import { Catalog } from "@models/catalog";

/* services */
import { LinksService } from "@services/links.service";

@Component({
  selector: "app-catalogs",
  standalone: true,
  providers: [LinksService],
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: "./catalogs.view.html",
})
export class CatalogsView implements OnInit {
  constructor(private linksService: LinksService) {}

  listCatalogs: Array<Catalog | null> = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ];

  ngOnInit() {
    this.listCatalogs = this.linksService.getCatalogs();
  }
}
