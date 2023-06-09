import {Injectable} from '@angular/core';
import {Router} from "@angular/router";

export enum AppRoutesEnum {
  CORE = '/core',
  AUTH = '/auth',
  COMMON = '/common',
  RRHH = '/rrhh'
}

@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  constructor(private router: Router) {
  }

  get core(): string {
    return AppRoutesEnum.CORE;
  }

  get common(): string {
    return AppRoutesEnum.COMMON;
  }

  get appRoutes(): string {
    return '';
  }

  login() {
    this.router.navigateByUrl(`${AppRoutesEnum.AUTH}/login`);
  }

  profile() {
    this.router.navigateByUrl(`${AppRoutesEnum.AUTH}/profile`);
  }

  menuStudent() {
    this.router.navigateByUrl(`${AppRoutesEnum.AUTH}./menu-student`);
  }

  dashboard() {
    this.router.navigateByUrl(`/`);
  }

  home() {
    this.router.navigateByUrl(`${AppRoutesEnum.RRHH}./events`);
  }
}
