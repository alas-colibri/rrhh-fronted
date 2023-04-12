import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogueModel, CatalogueTypeModel } from '@models/resources';
import { CreatePersonDto, PersonModel, UpdatePersonDto } from '@models/rrhh/person.model';
import { AuthHttpService, AuthService } from '@services/auth';
import { BreadcrumbService, CatalogueTypesHttpService, CoreService, MessageService } from '@services/resources';
import { CataloguesHttpService } from '@services/resources/catalogues-http.service';
import { RoutesService } from '@services/resources/routes.service';
import { PersonalInformationService } from '@services/rrhh';
import { CatalogueTypeEnum } from '@shared/enums';
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
  selectedmaritalStatus: any;
  selectedGenders: any;
  selectedTypeContractField: any;
  isLoadingSkeleton: boolean = false;
  form: UntypedFormGroup = this.newForm;
  typeContract: any;
  genders: any;
  identificationTypes: CatalogueTypeModel[] = [];
  maritalStatus: any;
  sexes: CatalogueTypeModel[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private personalInformationService: PersonalInformationService,
    private activatedRoute: ActivatedRoute,
    private catalogueService: CatalogueTypesHttpService,
    private personService: PersonalInformationService,

  ) {
    this.breadcrumbService.setItems([
      { label: 'Ficha Personal' },
    ]);
    //this.loadGenders();
    //this.loadTypeContract();

    this.typeContract = [
      { name: 'Temporal', code: 'Tem' },
      { name: 'Indefinido', code: 'Ind' }
    ];

    this.maritalStatus = [
      { name: 'Soltero/a', code: 'Solt' },
      { name: 'Casado/a', code: 'Cas' },
      { name: 'Divorciado/a', code: 'Div' },
      { name: 'Union Libre', code: 'ULR' }
    ];

    this.cities = [
      { name: 'Quito', code: 'UIO' },
      { name: 'Ibarra', code: 'IBR' },
      { name: 'Guayaquil', code: 'GUA' }
    ];

    this.genders = [
      { name: 'Masculino', code: 'M' },
      { name: 'Femenino', code: 'F' },
      { name: 'Prefiero no decirlo', code: 'PNC' }
    ];
    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.getEvent()
    }
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


    });
  }


  onSubmit(): void {

    console.log(this.form.value)
    if (this.form.valid) {
      if (this.id != 'new ') {
        this.update(this.form.value);
      } else {
       this.create(this.form.value);
      }
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields.then();
    }
  }


  ngOnInit() {

  }

  redirectCreateForm() {
    this.router.navigate(['/uic/student-informations', 'new']);
  }

 // loadGenders(): void {
   // this.catalogueService.catalogueType(CatalogueTypeEnum.GENDER).subscribe((genders) => this.genders = genders);
 // }

 // loadMaritalStatus(): void {
 //   this.catalogueService.catalogueType(CatalogueTypeEnum.MARITAL_STATUS).subscribe((maritalStatus) => this.maritalStatus = maritalStatus);
 // }

 // loadTypeContract(): void {
 //   this.catalogueService.catalogueType(CatalogueTypeEnum.SEX).subscribe((sexes) => this.sexes = sexes);
 // }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/student-informations', id]);
  }
  back(): void {
    this.router.navigate(['/rrhh/personal-info']);
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



  getEvent(): void {
    this.isLoadingSkeleton = true;
    this.personalInformationService.findOne(this.id).subscribe((person) => {
      this.isLoadingSkeleton = false;
      person.birthdate = new Date(person.birthdate)
      this.form.patchValue(person);
    });
  }

  create(person: CreatePersonDto): void {
    this.personService.create(person).subscribe(person => {
      this.form.reset(person);
      this.back();
    });
  }

  update(person: UpdatePersonDto): void {
    this.personService.update(this.id, person).subscribe((person) => {
      this.form.reset(person);
      this.back()
    });
  }
}
