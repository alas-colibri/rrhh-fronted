import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { PersonalInformationComponent } from './personal-information.component';
import { PersonalComponent } from './personal/personal.component';

const routes: Routes = [
  {
    path: '',
    component: PersonalInformationComponent
  },
  {
    path: ':id',
    component: PersonalComponent
  },
  {
    path: 'new',
    component: PersonalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalInformationRoutingModule {
}
