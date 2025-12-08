/* sys lib */
import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { RouterModule } from "@angular/router";

/* materials */
import { MatIconModule } from "@angular/material/icon";

/* models */
import { Link } from "@models/link";

/* services */
import { RecentLinksService } from "@services/recent-links.service";

@Component({
  selector: "app-tile-item",
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: "./tile-item.view.html",
})
export class TileItemView {
  constructor(private recentLinksService: RecentLinksService) {}

  @Input() link: Link | null = null;

  addLink(linkId: string) {
    this.recentLinksService.addRecentLink(linkId);
  }
}
