import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {BreadcrumbService, CoreService, MessageService} from '@services/resources';
import {OnExitInterface} from '@shared/interfaces';
import { ProyectHttpService } from '@services/rrhh';
import { CatalogueTypeEnum } from '@shared/enums';
import { format } from 'date-fns';
import { DateValidators } from '@shared/validators';
import { CreateProyectDto, UpdateProyectDto } from '@models/rrhh/proyect.model';

@Component({
  selector: 'app-proyect-form',
  templateUrl: './proyect-form.component.html',
  styleUrls: ['./proyect-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProyectFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Crear fase';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  checked: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private proyectHttpService: ProyectHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Convocatorias', routerLink: ['/rrhh/proyect']},
      {label: 'Nueva fase'},
    ]);
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
   // this.getProyect();
  }


  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      endDate: [null, [Validators.required,DateValidators.min(new Date())]],
      startDate: [null, [DateValidators.min(new Date())]],
      isEnable: [false, [Validators.required]],
      sort: [null, [Validators.required]],
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
    this.router.navigate(['/rrhh/proyect']);
  }

  create(proyect: CreateProyectDto): void {
    this.proyectHttpService.create(proyect).subscribe(proyect => {
      this.form.reset(proyect);
      this.back();
    });
  }


  getProyect(): void {
    this.isLoadingSkeleton = true;
    this.proyectHttpService.findOne(this.id).subscribe((proyect) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(proyect);
    });
  }

  update(proyect:UpdateProyectDto): void {
    this.proyectHttpService.update(this.id, proyect).subscribe((proyect) => {
      this.form.reset(proyect);
      this.back()
    });
  }

  // Getters

  get startDateField() {
    return this.form.controls['startDate'];
  }

  get endDateField() {
    return this.form.controls['endDate'];
  }

  get isEnableField() {
    return this.form.controls['isEnable'];
  }

  get sortField() {
    return this.form.controls['sort'];
  }

}
