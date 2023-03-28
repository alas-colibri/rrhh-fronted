import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: 'events',
    loadChildren: () =>
      import('./event/event.module').then((m) => m.EventModule),
  },
  {
    path: 'home-rrhh',
    loadChildren: () =>
      import('./home-rrhh/home-rrhh.module').then((m) => m.HomeRrhhModule),

  },

  {
    path: 'proyect',
    loadChildren: () =>
      import('./proyect/proyect.module').then((m) => m.ProyectModule),

  },

  {
    path: 'holiday',
    loadChildren: () =>
      import('./holiday/holiday.module').then((m) => m.HolidayModule),

  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UicRoutingModule {
}
