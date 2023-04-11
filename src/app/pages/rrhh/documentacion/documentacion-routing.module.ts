import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from '@shared/guards';
import { DocumentacionFormComponent } from './documentacion-form/documentacion-form.component';
import { DocumentacionComponent } from './documentacion.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentacionComponent
  },
  {
    path: ':id',
    component: DocumentacionFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentacionRoutingModule {
}
