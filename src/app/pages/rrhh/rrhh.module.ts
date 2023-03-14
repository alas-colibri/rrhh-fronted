import {NgModule} from '@angular/core';
import {CommonModule as NgCommonModule} from '@angular/common';
import {UicRoutingModule} from './rrhh-routing.module';
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {MessageModule} from "primeng/message";
import { FileUploadModule } from 'primeng/fileupload';

@NgModule({
  declarations: [],
  imports: [
    NgCommonModule,
    UicRoutingModule,
    ButtonModule,
    RippleModule,
    MessageModule,
    FileUploadModule
  ]
})
export class RrhhModule {
}
