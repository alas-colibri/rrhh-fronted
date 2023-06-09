import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateHolidayDto, UpdateHolidayDto } from '@models/rrhh';
import { PersonModel } from '@models/rrhh/person.model';
import { ProjectAssignmentModel } from '@models/rrhh/projectAssignment';
import { BreadcrumbService, CoreService, MessageService } from '@services/resources';
import { HolidayHttpService, PersonalInformationService } from '@services/rrhh';
import { ProjectAssignmentHttpService } from '@services/rrhh/projectAssignment-http.service';
import { CatalogueTypeEnum } from '@shared/enums';
import { DateValidators } from '@shared/validators';

@Component({
  selector: 'app-holiday-form',
  templateUrl: './holiday-form.component.html',
  styleUrls: ['./holiday-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HolidayFormComponent implements OnInit {

  id: string = '';
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Asignar Vacaciones';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  checked: boolean = true;
  persons: PersonModel[]=[];
  typeHoliday: any;
  selectedTypeHolidayField: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private holidayHttpService: HolidayHttpService,
    private proyectAsHttpService: ProjectAssignmentHttpService,
    private personHttpService: PersonalInformationService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Listado', routerLink: ['/rrhh/holiday']},
      {label: 'Vacaciones'},
    ]);

    this.typeHoliday = [
      { name: 'Dependencia', code: 'Dep'},
      { name: 'Consultoria', code: 'Con' }
    ]

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Guardar Modalidad';
    }
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.getProyectAsName();
    this.getHoliday();
  }


  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      endDate: [null, [Validators.required,DateValidators.min(new Date())]],
      startDate: [null, [DateValidators.min(new Date())]],
      typeHoliday: [null, [Validators.required]],
      observation: [null, [Validators.required]],
      person: [null ],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.id != '') {
        this.update(this.form.value);
      } else {
        this.create(this.form.value);
      }
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields.then();
    }
  }

  back(): void {
    this.router.navigate(['/rrhh/holiday']);
  }

  create(holiday: CreateHolidayDto): void {
    this.holidayHttpService.create(holiday).subscribe(holiday => {
      this.form.reset(holiday);
      this.back();
    });
  }

  update(holiday:UpdateHolidayDto): void {
    this.holidayHttpService.update(this.id, holiday).subscribe((holiday) => {
      this.form.reset(holiday);
      this.back()
    });
  }


  getHoliday(): void {
    this.isLoadingSkeleton = true;
    this.holidayHttpService.findOne(this.id).subscribe((holiday) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(holiday);
    });
  }

  getProyectAsName(): void{
    this.isLoadingSkeleton = true;
    this.personHttpService.person(CatalogueTypeEnum.PERSON).subscribe((persons) => {
        this.isLoadingSkeleton=false;
        this.persons = persons;
    })
  }


  // Getters

  get startDateField() {
    return this.form.controls['startDate'];
  }

  get endDateField() {
    return this.form.controls['endDate'];
  }

  get personField() {
    return this.form.controls['person'];
  }

  get observationField() {
    return this.form.controls['observation'];
  }

  get typeHolidayField() {
    return this.form.controls['typeHoliday'];
  }


}
