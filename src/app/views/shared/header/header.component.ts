/* sys lib */
import { CommonModule, Location } from "@angular/common";
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Output,
} from "@angular/core";
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from "@angular/router";
import { filter, map } from "rxjs";

/* materials */
import { MatIconModule } from "@angular/material/icon";

/* models */
import { Catalog } from "@models/catalog";
import { Link } from "@models/link";

/* services */
import { LinksService } from "@services/links.service";

@Component({
  selector: "app-header",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: "./header.component.html",
})
export class HeaderComponent {
  constructor(
    private router: Router,
    private location: Location,
    private linksService: LinksService
  ) {}

  @Output() isShowNavEvent: EventEmitter<boolean> = new EventEmitter();

  listCatalogs: Array<Catalog> = [];
  listLinks: Array<Link> = [];

  themeVal: string = "";
  prevTitle: string = "";
  title: string = "";
  iconUrl: string = "";

  // isShowBackBut: boolean = false;

  ngOnInit(): void {
    this.themeVal = localStorage.getItem("theme") ?? "";

    this.listCatalogs = this.linksService.getCatalogs();
    this.listLinks = this.linksService.getAllLinks();

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        ),
        map(() => {
          let route: ActivatedRoute = this.router.routerState.root;
          let prevRouteTitle: string = "";
          let routeTitle: string = "";
          let routeId: string = "";
          let typeId: string = "";

          while (route!.firstChild) {
            route = route.firstChild;
          }

          if (
            route.snapshot.data["dynamic"] &&
            route.snapshot.routeConfig?.path == ""
          ) {
            const id = route.snapshot.params["id"];
            if (id) {
              const catalog = this.listCatalogs.find(
                (catalog) => catalog.id === id
              );
              routeTitle = catalog?.name ?? "";
              routeId = catalog?.id ?? "";
              typeId = "catalog";
            }
          } else {
            routeTitle = route.snapshot.data["breadcrumbs"];
            const path = route.snapshot.url[0]?.path;
            if (path) {
              const catalog = this.listLinks.find((link) => link.url === path);
              routeId = catalog?.id ?? "";
              typeId = "link";
            }
          }

          if (route.parent!.routeConfig?.path?.startsWith(":")) {
            if (route.snapshot.routeConfig?.path == "") {
              prevRouteTitle =
                route.parent!.parent?.snapshot.data["breadcrumbs"];
            } else {
              const id = route.parent!.snapshot.params["id"];
              if (id) {
                const catalog = this.listCatalogs.find(
                  (catalog) => catalog.id === id
                );
                prevRouteTitle = catalog?.name ?? "";
              }
            }
          }

          return { prevRouteTitle, routeTitle, routeId, typeId };
        })
      )
      .subscribe(
        (data: {
          prevRouteTitle: string;
          routeTitle: string;
          routeId: string;
          typeId: string;
        }) => {
          if (data.routeId != "") {
            switch (data.typeId) {
              case "catalog":
                const catalog = this.listCatalogs.find(
                  (catalog) => catalog.id === data.routeId
                );
                this.iconUrl = catalog?.icon ?? "";
                break;
              case "link":
                const link = this.listLinks.find(
                  (link) => link.id === data.routeId
                );
                this.iconUrl = link?.icon[0] ?? "";
                break;
              default:
                break;
            }
          } else {
            this.iconUrl = "";
          }

          this.title = data.routeTitle;
          this.prevTitle = data.prevRouteTitle;
        }
      );
  }

  goBack() {
    this.location.back();
  }

  showNav() {
    this.isShowNavEvent.next(true);
  }

  setTheme(theme: string) {
    document.querySelector("html")!.setAttribute("class", theme);
    localStorage.setItem("theme", theme);
    this.themeVal = theme;
  }
}
