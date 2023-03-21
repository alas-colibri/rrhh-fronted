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
    path: 'personal-info',
    loadChildren: () =>
      import('./personal-information/personal-information.module').then((m) => m.PersonalInformationModule),

  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UicRoutingModule {
}
