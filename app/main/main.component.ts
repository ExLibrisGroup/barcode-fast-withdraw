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
  AfterViewInit,
} from "@angular/core";
import {
  CloudAppRestService,
  CloudAppEventsService,
  Request,
  HttpMethod,
  RestErrorResponse,
  CloudAppStoreService,
} from "@exlibris/exl-cloudapp-angular-lib";
import { MatInput } from "@angular/material/input";

class StoreSettings {
  holdings: string = "retain";
  override: boolean = false;
}
@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit, AfterViewInit {
  @ViewChild("barcodeVar", { static: true }) barcodeEl: MatInput;
  barcode: string = "";
  storeSettings = new StoreSettings();
  loading: boolean = false;
  barcodesDeleted: string[] = [];
  constructor(
    private restService: CloudAppRestService,
    private storeService: CloudAppStoreService,
    private toaster: ToastrService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.storeService
      .get("settings")
      .subscribe({
        next: (res) =>{ if (res){Object.keys(res).length > 0 ? (this.storeSettings = res) : null;}
        this.loading = false;},
      });
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.barcodeEl._focusChanged(true);
      this.barcodeEl.focus();
    });
  }
  onChangeSettings() {
    this.storeService
      .set("settings", this.storeSettings)
      .subscribe(() => console.log("Stored settings"));
  }

  reset() {
    this.barcode = "";
    this.loading = false;
    setTimeout(() => this.barcodeEl.focus(), 300);
  }

  onDelete() {
    if (this.barcode === "") {
      this.toaster.error("Please enter barcode");
      return;
    }
    console.log("onDelete");
    this.loading = true;
    this.restService
      .call("/items?item_barcode=" + this.barcode)
      .pipe(
        switchMap((res) => {
          let requst: Request = {
            url: res.link,
            method: HttpMethod.DELETE,
            queryParams: { override: this.storeSettings.override, holdings: this.storeSettings.holdings },
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
