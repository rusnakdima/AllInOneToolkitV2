export class Common {
  static formatTime(date: Date | string): string {
    if (typeof date === "string") {
      date = new Date(date);
    }
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  static formatLocaleDate(date: Date | string): string {
    if (typeof date === "string") {
      date = new Date(date);
    }
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  static formatDate(time: string): string {
    const dateRec = new Date(time);
    const curDate = new Date();
    const year = dateRec.getFullYear();
    const month = dateRec.getMonth();
    const day = dateRec.getDate();
    const curYear = curDate.getFullYear();
    const curMonth = curDate.getMonth();
    const curDay = curDate.getDate();

    if (day === curDay && month === curMonth && year === curYear) {
      return this.formatTime(dateRec);
    }
    const yesterday = new Date(curDate);
    yesterday.setDate(curDate.getDate() - 1);
    if (
      day === yesterday.getDate() &&
      month === yesterday.getMonth() &&
      year === yesterday.getFullYear()
    ) {
      return `Yesterday ${this.formatTime(dateRec)}`;
    }

    const twoDaysAgo = new Date(curDate);
    twoDaysAgo.setDate(curDate.getDate() - 1);
    if (dateRec < twoDaysAgo) {
      return this.formatLocaleDate(dateRec);
    }
    return "";
  }

  static truncateString(str: string, length: number = 25): string {
    if (str) {
      const endIndex: number = length;
      if (str.length <= endIndex) {
        return str;
      }

      return str.slice(0, endIndex) + "...";
    }
    return "";
  }

  static formatTimeAgo(date: string | number | Date): string {
    const dateRec = new Date(date);
    const curDate = new Date();

    if (curDate.getTime() >= dateRec.getTime()) {
      const year = Math.floor(
        (curDate.getTime() - dateRec.getTime()) / (1000 * 60 * 60 * 24 * 365)
      );
      if (year > 0) {
        if (year == 0) {
          return `${year} year ago`;
        }
        return `${year} years ago`;
      }

      const days = Math.floor(
        (curDate.getTime() - dateRec.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (days > 0) {
        if (days == 1) {
          return `${days} day ago`;
        }
        return `${days} days ago`;
      }

      const hours = Math.floor(
        (curDate.getTime() - dateRec.getTime()) / (1000 * 60 * 60)
      );
      if (hours > 0) {
        if (hours == 1) {
          return `${hours} hour ago`;
        }
        return `${hours} hours ago`;
      }

      const minutes = Math.floor(
        (curDate.getTime() - dateRec.getTime()) / (1000 * 60)
      );
      if (minutes > 0) {
        if (minutes == 1) {
          return `${minutes} minute ago`;
        }
        return `${minutes} minutes ago`;
      }

      const seconds = Math.floor(
        (curDate.getTime() - dateRec.getTime()) / 1000
      );
      if (seconds >= 0) {
        if (seconds == 1 || seconds == 0) {
          return `${seconds} second ago`;
        }
        return `${seconds} seconds ago`;
      }
    }

    return "";
  }

  static formatTimeIn(date: string | number | Date): string {
    const dateRec = new Date(date);
    const curDate = new Date();

    if (dateRec.getTime() >= curDate.getTime()) {
      const year = Math.floor(
        (dateRec.getTime() - curDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
      );
      if (year > 0) {
        if (year == 0) {
          return `in ${year} year`;
        }
        return `in ${year} years`;
      }

      const days = Math.floor(
        (dateRec.getTime() - curDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (days > 0) {
        if (days == 1) {
          return `in ${days} day`;
        }
        return `in ${days} days`;
      }

      const hours = Math.floor(
        (dateRec.getTime() - curDate.getTime()) / (1000 * 60 * 60)
      );
      if (hours > 0) {
        if (hours == 1) {
          return `in ${hours} hour`;
        }
        return `in ${hours} hours`;
      }

      const minutes = Math.floor(
        (dateRec.getTime() - curDate.getTime()) / (1000 * 60)
      );
      if (minutes > 0) {
        if (minutes == 1) {
          return `in ${minutes} minute`;
        }
        return `in ${minutes} minutes`;
      }

      const seconds = Math.floor(
        (dateRec.getTime() - curDate.getTime()) / 1000
      );
      if (seconds >= 0) {
        if (seconds == 1 || seconds == 0) {
          return `in ${seconds} second`;
        }
        return `in ${seconds} seconds`;
      }
    }

    return "";
  }
}
