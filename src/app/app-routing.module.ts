import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BlankComponent, MainComponent} from '@layout';
import {RoleGuard, TokenGuard} from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [TokenGuard],
    children: [
      {path: '', redirectTo: '/', pathMatch: 'full'},
      {
        path: 'administration',
        title: 'Administration',
        loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule),
      },
      {
        path: 'rrhh',
        title: 'rrhh',
        loadChildren: () => import('./pages/rrhh/rrhh.module').then(m => m.RrhhModule),
      },
    ]
  },
  {
    path: 'login',
    redirectTo: '/auth/authentication/login'
  },
  {
    path: 'profile',
    redirectTo: '/administration/users/profile'
  },
  {
    path: 'auth',
    title: 'Auth',
    component: BlankComponent,
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'common',
    title: 'Common',
    component: BlankComponent,
    loadChildren: () => import('./pages/common/common.module').then(m => m.CommonModule),
  },
  {
    path: '**',
    redirectTo: '/common/not-found'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
