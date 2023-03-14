import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EventComponent} from './event.component';
import {EventFormComponent} from './event-form/event-form.component';
import {ExitGuard} from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: EventComponent
  },
  {
    path: ':id',
    component: EventFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventRoutingModule {
}
