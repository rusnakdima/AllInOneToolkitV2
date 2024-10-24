/* sys lib */
import { Injectable } from "@angular/core";

/* models */
import { Link } from "@models/link";

/* services */
import { LinksService } from "./links.service";

@Injectable({
  providedIn: "root",
})
export class RecentLinksService {
  constructor(private linksService: LinksService) {}

  getListLinksForStorage(): Array<string> {
    return JSON.parse(
      localStorage.getItem("recentLinks") ?? "[]"
    ) as Array<string>;
  }

  getAllRecentLinks(): Array<Link> {
    const data = this.getListLinksForStorage();
    if (data.length > 0) {
      const links = this.linksService.getAllLinks();
      const recentLinks: Array<Link> = [];
      data.forEach(linkId => {
        const result = links.find((link) => link?.id === linkId);
        if (result) {
          recentLinks.push(result);
        }
      });
      return recentLinks;
    } else {
      return [];
    }
  }

  addRecentLink(linkId: string): void {
    let recentLinks = this.getListLinksForStorage();
    const links = this.linksService.getAllLinks();
    const link = links.find((link) => link?.id === linkId);
    if (link) {
      if (recentLinks.includes(link.id)) {
        recentLinks = recentLinks.filter((id) => id !== link.id);
      }
      recentLinks.unshift(link.id);
    }
    if (recentLinks.length > 10) {
      recentLinks = recentLinks.slice(0, 10);
    }
    localStorage.setItem("recentLinks", JSON.stringify(recentLinks));
  }
}
