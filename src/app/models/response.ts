export enum ResponseStatus {
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}

export enum ResponseStatusIcon {
  SUCCESS = 'check_circle',
  INFO = 'info_outlined',
  WARNING = 'warning',
  ERROR = 'error',
  '' = 'notifications',
}

export interface INotify {
  status: ResponseStatus;
  message: string;
}

export interface ActiveNotification extends INotify {
  id: number;
  width: number;
  color: string;
  icon: ResponseStatusIcon;
  intervalId?: number;
  timeoutId?: number;
}

export class Response {
  constructor(
    public status: ResponseStatus,
    public message: string,
    public data: any
  ) {}
}
