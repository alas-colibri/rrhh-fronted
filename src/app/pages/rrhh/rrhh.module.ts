import {NgModule} from '@angular/core';
import {CommonModule as NgCommonModule} from '@angular/common';
import {UicRoutingModule} from './rrhh-routing.module';
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {MessageModule} from "primeng/message";
import { FileUploadModule } from 'primeng/fileupload';
import { SharedModule } from "../../shared/shared.module";


@NgModule({
    declarations: [

    ],
    imports: [
        NgCommonModule,
        UicRoutingModule,
        ButtonModule,
        RippleModule,
        MessageModule,
        FileUploadModule,
        SharedModule
    ]
})
export class RrhhModule {
}
