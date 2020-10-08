import { Subscription } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  CloudAppRestService,
  CloudAppEventsService,
  Request,
  HttpMethod,
  Entity,
  PageInfo,
  RestErrorResponse,
} from "@exlibris/exl-cloudapp-angular-lib";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent {
  barcode: string = "";

  constructor(private restService: CloudAppRestService, private toaster: ToastrService) {}

  onDelete() {
    console.log("onDelete");
    this.restService
      .call("/items?item_barcode=" + this.barcode)
      .pipe(switchMap((res) => this.restService.(res.link)))
      .subscribe((result)=>console.log('final',result));
  }
}
