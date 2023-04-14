import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DocumentosComponent, } from './documentos.component';
import {DocumentosFormComponent, } from './documentos-form/documentos-form.component';
import {ExitGuard} from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: DocumentosComponent
  },
  {
    path: ':id',
    component: DocumentosFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentosRoutingModule {
}
