import {Component, OnInit} from '@angular/core';
import {AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {AuthHttpService, AuthService} from '@services/auth';
import {BreadcrumbService, CoreService, MessageService} from '@services/resources';
import { RoutesService } from '@services/resources/routes.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  planning:string;
  loaded$ = this.coreService.loaded$;
  logoDataUrl: string;

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
  ) {
    this.breadcrumbService.setItems([
      { label: 'Menú Colibrí' },
    ]);
  }

  ngOnInit() {
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/student-informations', 'new']);
  }

  redirectCreateForme() {
    this.router.navigate(['/uic/student-informations/complexivo', 'new']);
  }


  redirectEditForm(id: string) {
    this.router.navigate(['/uic/student-informations', id]);
  }
}
