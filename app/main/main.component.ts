import { Subscription, throwError } from "rxjs";
import { catchError, finalize, map, switchMap } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  CloudAppRestService,
  CloudAppEventsService,
  Request,
  HttpMethod,
  RestErrorResponse,
} from "@exlibris/exl-cloudapp-angular-lib";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent {
  barcode: string = "";
  override = false;
  holdings:string = "retain";
  loading: boolean = false;
  barcodesDeleted:string[] = [];
  constructor(private restService: CloudAppRestService, private toaster: ToastrService) {}

  onDelete() {
    console.log("onDelete");
    this.restService
      .call("/items?item_barcode=" + this.barcode)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.barcode = "";
        }),
        switchMap((res) => {
          let requst: Request = {
            url: res.link,
            method: HttpMethod.DELETE,
            queryParams: { override: this.override, holdings: this.holdings },
          };
          return this.restService.call(requst);
        })
      )
      .subscribe({
        next: () => {
          this.barcodesDeleted.unshift(this.barcode);
          this.toaster.success(this.barcode + " successfully withdrawn");
        },
        error: (err: RestErrorResponse) => {
          
          console.log(err.message),
          this.toaster.error(this.barcode + " could not be withdrawn with error: " + err.message);
        },
      });
  }
}
