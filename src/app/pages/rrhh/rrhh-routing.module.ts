import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'questions',
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
      import('./personal-information/personal-information.module').then(
        (m) => m.PersonalInformationModule
      ),
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
  {
    path: 'projectAssignment',
    loadChildren: () =>
      import('./projectAssignment/projectAssignment.module').then((m) => m.ProjectAssignmentModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UicRoutingModule {}
