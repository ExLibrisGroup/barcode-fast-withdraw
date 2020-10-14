import { Subscription, throwError } from "rxjs";
import { catchError, finalize, map, switchMap } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from "@angular/core";
import {
  CloudAppRestService,
  CloudAppEventsService,
  Request,
  HttpMethod,
  RestErrorResponse,
} from "@exlibris/exl-cloudapp-angular-lib";
import { MatInput } from "@angular/material/input";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent {
  @ViewChild("barcodeVar", { static: true }) barcodeEl: MatInput;
  barcode: string = "";
  override = false;
  holdings: string = "retain";
  loading: boolean = false;
  barcodesDeleted: string[] = [];
  constructor(private restService: CloudAppRestService, private toaster: ToastrService) {}
  ngOnInit() {
  }
  ngAfterViewInit() {
    setTimeout(() => {this.barcodeEl._focusChanged(true);this.barcodeEl.focus()});  
  }

  reset() {
    this.barcode = "";
    this.loading = false;
    // document.getElementById("barcode").focus({ preventScroll: true });
    setTimeout(() => this.barcodeEl.focus(), 300);
  }

  onDelete() {
    console.log("onDelete");
    this.loading = true;
    this.restService
      .call("/items?item_barcode=" + this.barcode)
      .pipe(
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
          this.toaster.success("Item with barcode : " + this.barcode + " successfully withdrawn");
        },
        error: (err: RestErrorResponse) => {
          console.log(err.message),
            this.toaster.error(
              "Item with barcode : " +
                this.barcode +
                " could not be withdrawn with error: " +
                err.message
            );
          this.reset();
        },
        complete: () => {
          this.reset();
        },
      });
  }
}
