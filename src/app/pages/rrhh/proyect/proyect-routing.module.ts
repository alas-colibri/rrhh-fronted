import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProyectComponent} from './proyect.component';
import {ExitGuard} from '@shared/guards';
import { ProyectFormComponent } from './proyect-form/proyect-form.component';

const routes: Routes = [
  {
    path: '',
    component: ProyectComponent
  },
  {
    path: ':id',
    component: ProyectFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProyectRoutingModule {
}
