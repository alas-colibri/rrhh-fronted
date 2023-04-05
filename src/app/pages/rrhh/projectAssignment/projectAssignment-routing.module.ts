import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ExitGuard} from '@shared/guards';
import { ProjectAssignmentFormComponent } from './projectAssignment-form/projectAssignment-form.component';
import { ProjectAssignmentComponent } from './projectAssignment.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectAssignmentComponent
  },
  {
    path: ':id',
    component: ProjectAssignmentFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectAssignmentRoutingModule {
}
