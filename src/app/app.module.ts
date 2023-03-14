import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpInterceptorProviders} from './interceptors';
import {HttpClientModule} from '@angular/common/http';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {MultiSelectModule} from 'primeng/multiselect';
import {
  FooterComponent,
  TopbarComponent,
  SidebarComponent,
  BlankComponent,
  MainComponent,
  BreadcrumbComponent
} from '@layout';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {MenubarModule} from 'primeng/menubar';
import {ButtonModule} from 'primeng/button';
import { InputSwitchModule } from "primeng/inputswitch";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SharedModule} from "@shared/shared.module";
import { FileUploadModule } from 'primeng/fileupload';
import {TabViewModule} from 'primeng/tabview';

@NgModule({
  declarations: [
    AppComponent,
    BlankComponent,
    BreadcrumbComponent,
    FooterComponent,
    MainComponent,
    SidebarComponent,
    TopbarComponent,
  ],
  imports: [
    BrowserModule,
    MultiSelectModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    BreadcrumbModule,
    MenubarModule,
    ButtonModule,
    FileUploadModule,
    InputSwitchModule,
    TabViewModule,
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    HttpInterceptorProviders,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
