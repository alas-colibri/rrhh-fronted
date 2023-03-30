import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HolidayComponent } from './holiday.component';
import { HolidayFormComponent } from './holiday-form/holiday-form.component';
import { ExitGuard } from '@shared/guards';


const routes: Routes = [
  {
    path: '',
    component: HolidayComponent
  },
  {
    path: ':id',
    component: HolidayFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HolidayRoutingModule { }
