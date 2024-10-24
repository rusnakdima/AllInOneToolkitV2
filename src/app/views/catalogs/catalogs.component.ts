/* sys lib */
import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

/* materials */
import { MatIconModule } from '@angular/material/icon';

/* models */
import { Catalog } from '@models/catalog';

/* services */
import { LinksService } from '@services/links.service';

@Component({
  selector: 'app-catalogs',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  providers: [LinksService],
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './catalogs.component.html'
})
export class CatalogsComponent implements OnInit {
  constructor(
    private linksService: LinksService,
  ) {}

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
