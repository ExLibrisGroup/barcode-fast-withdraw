import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule, getTranslateModule } from "@exlibris/exl-cloudapp-angular-lib";
import { ToastrModule } from "ngx-toastr";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { MainComponent } from "./main/main.component";
import { FormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import {MatCheckboxModule} from '@angular/material/checkbox';
import { HelpComponent } from './help/help.component';
import  {AlertModule} from '@exlibris/exl-cloudapp-angular-lib';
export function getToastrModule() {
  return ToastrModule.forRoot({
    positionClass: "toast-top-right",
    timeOut: 4000,
  });
}

@NgModule({
  declarations: [AppComponent, MainComponent, HelpComponent],
  imports: [
    AlertModule,
    MaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    getTranslateModule(),
    getToastrModule(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
