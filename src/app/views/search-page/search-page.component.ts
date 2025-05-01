/* sys lib */
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { NgxPaginationModule } from "ngx-pagination";

/* models */
import { Link } from "@models/link";

/* services */
import { LinksService } from "@services/links.service";

/* components */
import { SearchComponent } from "@shared/fields/search/search.component";
import { TileItemComponent } from "@views/items/tile-item/tile-item.component";
import { ShowItemComponent } from "@shared/fields/show-item/show-item.component";
import { PaginationComponent } from "@shared/pagination/pagination.component";

@Component({
  selector: "app-search-page",
  standalone: true,
  imports: [
    CommonModule,
    NgxPaginationModule,
    SearchComponent,
    TileItemComponent,
    ShowItemComponent,
    PaginationComponent,
  ],
  templateUrl: "./search-page.component.html",
})
export class SearchPageComponent {
  constructor(private linksService: LinksService) {}

  listLinks: Array<Link> = [];
  tempListLinks: Array<Link> = [];

  page: number = 1;
  perItem: number = 10;

  ngOnInit(): void {
    this.tempListLinks = this.linksService.getAllLinks();
    this.listLinks = this.tempListLinks.slice();
  }

  searchFunc(arr: Array<any>) {
    this.listLinks = arr;
    this.page = 1;
  }

  onChangePerItem(event: any) {
    this.perItem = event;
    this.page = 1;
  }

  onChangeCountPage(event: any) {
    this.page = event;
  }
}
