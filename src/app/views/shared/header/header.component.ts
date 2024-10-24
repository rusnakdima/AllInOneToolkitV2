/* sys lib */
import { CommonModule, Location } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, map } from 'rxjs';

/* materials */
import { MatIconModule } from '@angular/material/icon';

/* models */
import { Catalog } from '@models/catalog';

/* services */
import { LinksService } from '@services/links.service';

@Component({
  selector: 'app-header',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  constructor(
    private router: Router,
    private location: Location,
    private linksService: LinksService,
  ) {}

  @Output() isShowNavEvent: EventEmitter<boolean> = new EventEmitter();

  listCatalogs: Array<Catalog> = [];

  themeVal: string = '';
  prevTitle: string = 'Prev';
  title: string = '';

  // isShowBackBut: boolean = false;

  ngOnInit(): void {
    this.themeVal = localStorage.getItem('theme') ?? '';

    this.listCatalogs = this.linksService.getCatalogs();

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        map(() => {
          let route: ActivatedRoute = this.router.routerState.root;
          let prevRouteTitle = '';
          let routeTitle = '';
          while (route!.firstChild) {
            route = route.firstChild;
          }

          if (route.snapshot.data['dynamic'] && route.snapshot.routeConfig?.path == "") {
            const id = route.snapshot.params['id'];
            if (id) {
              const catalog = this.listCatalogs.find(catalog => catalog.id === id);
              routeTitle = catalog?.name ?? '';
            }
          } else {
            routeTitle = route.snapshot.data['breadcrumbs'];
          }

          if (route.parent!.routeConfig?.path?.startsWith(':')) {
            if (route.snapshot.routeConfig?.path == "") {
              prevRouteTitle = route.parent!.parent?.snapshot.data['breadcrumbs'];
            } else {
              const id = route.parent!.snapshot.params['id'];
              if (id) {
                const catalog = this.listCatalogs.find(catalog => catalog.id === id);
                prevRouteTitle = catalog?.name ?? '';
              }
            }
          }

          return { prevRouteTitle, routeTitle };
        })
      )
      .subscribe((data: { prevRouteTitle: any, routeTitle: string }) => {
        // if (this.router.url.split('/').slice(1).length > 1) {
        //   this.isShowBackBut = true;
        // } else {
        //   this.isShowBackBut = false;
        // }
        this.title = data.routeTitle;
        this.prevTitle = data.prevRouteTitle;
      });
  }

  goBack() {
    this.location.back();
  }

  showNav() {
    this.isShowNavEvent.next(true);
  }

  setTheme(theme: string) {
    document.querySelector('html')!.setAttribute("class", theme);
    localStorage.setItem('theme', theme);
    this.themeVal = theme;
  }
}
