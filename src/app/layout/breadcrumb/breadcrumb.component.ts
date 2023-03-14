import {Component, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';
import {MenuItem} from 'primeng/api';
import {BreadcrumbService, CoreService} from '@services/resources';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BreadcrumbComponent {
  subscription: Subscription;
  items: MenuItem[] = [];
  home: MenuItem;
  form: MenuItem;
  proyect: MenuItem;
  vacations: MenuItem;
  list: MenuItem;
  loaded$ = this.coreService.loaded$;

  constructor(public breadcrumbService: BreadcrumbService,private coreService:CoreService) {
    this.subscription = breadcrumbService.itemsHandler.subscribe(response => {
      this.items = response as MenuItem[];
    });
    this.home = {icon: 'pi pi-home', routerLink: '/'};
    this.form = {icon: 'pi pi-file-edit', routerLink: '/'};
    this.proyect = {icon: 'pi pi-folder', routerLink: '/'};
    this.vacations = {icon: 'pi pi-calendar-plus', routerLink: '/'};
    this.list = {icon: 'pi ppi-list', routerLink: '/'};
  }
}
