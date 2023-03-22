import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PersonModel } from '@models/rrhh/person.model';
import { AuthHttpService, AuthService } from '@services/auth';
import { BreadcrumbService, CoreService, MessageService } from '@services/resources';
import { RoutesService } from '@services/resources/routes.service';
import { PersonalInformationService } from '@services/rrhh';
import { DateValidators } from '@shared/validators';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})

export class PersonalComponent implements OnInit {
  planning: string;
  loaded$ = this.coreService.loaded$;
  id: any;
  logoDataUrl: string;
  cities: any;
  selectedCity: any;

  form: UntypedFormGroup = this.newForm;

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private personalInformationService: PersonalInformationService,

  ) {
    this.breadcrumbService.setItems([
      { label: 'Ficha Personal' },
    ]);
    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
    ];
  }


  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      names: [null, [Validators.required]],
      lastNames: [null, [Validators.required]],
      identificationCode: [null, [Validators.required]],
      civilStatus: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      birthdate: [null, [DateValidators.valid]],
      phone: [null, [Validators.required]],
      city: [null, [Validators.required]],
      profession: [null, [Validators.required]],
      typeContract: [null, [Validators.required]],
      projects: [null, [Validators.required]]

    });
  }


  onSubmit(): void {
    if (this.form.valid) {
     
      if (this.id != '') {
        //update
      } else {
        this.create(this.form.value);
      }
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields.then();
    }
  }


  create(person: PersonModel): void {
    this.personalInformationService.create(person).subscribe(person => {
      this.form.reset(person);
      this.back();
    });
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
  back(): void {
    this.router.navigate(['/rrhh/events']);
  }

  get namesField() {
    return this.form.controls['names'];
  }
  get lastNamesField() {
    return this.form.controls['lastNames'];
  }

  get identificationCodeField() {
    return this.form.controls['identificationCode'];
  }

  get civilStatusField() {
    return this.form.controls['civilStatus'];
  }

  get genderField() {
    return this.form.controls['gender'];
  }

  get birthdateField() {
    return this.form.controls['birthdate'];
  }

  get phoneField() {
    return this.form.controls['phone'];
  }

  get cityField() {
    return this.form.controls['city'];
  }

  get professionField() {
    return this.form.controls['profession'];
  }

  get typeContractField() {
    return this.form.controls['typeContract'];
  }

  get projectsField() {
    return this.form.controls['projects'];
  }


}
