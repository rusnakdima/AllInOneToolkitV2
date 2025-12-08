/* sys lib */
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

/* models */
import { Response, ResponseStatus } from "@models/response";

/* services */
import { MathService } from "@services/math.service";
import { NotifyService } from "@services/notify.service";

@Component({
  selector: "app-prime-number",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./prime-number.view.html",
})
export class PrimeNumberView {
  constructor(
    private mathService: MathService,
    private notifyService: NotifyService
  ) {}

  inputText: string = "";

  isEnteredNumber: boolean = false;
  isPrime: boolean = false;

  setData(event: any) {
    this.inputText = event.target.value;
  }

  calculate() {
    let text = this.inputText;
    this.mathService
      .numberIsPrime<boolean>(text)
      .then((response: Response<boolean>) => {
        this.notifyService.showNotify(response.status, response.message);
        if (response.status === ResponseStatus.SUCCESS) {
          this.isEnteredNumber = true;
          console.log(response.data);
          this.isPrime = response.data;
        } else {
          this.isEnteredNumber = true;
          this.isPrime = response.data;
        }
      })
      .catch((err: Response<boolean>) => {
        this.isEnteredNumber = true;
        this.isPrime = err.data;
        this.notifyService.showError(err.message ?? err.toString());
      });
  }
}
