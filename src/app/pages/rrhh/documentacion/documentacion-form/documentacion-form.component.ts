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
import { EventsHttpService } from '@services/rrhh';
import { CreateEventDto, EventModel, UpdateEventDto } from '@models/rrhh';
import { CatalogueTypeEnum } from '@shared/enums';
import { format } from 'date-fns';
import { DateValidators } from '@shared/validators';

@Component({
  selector: 'app-documentacion-form',
  templateUrl: './documentacion-form.component.html',
  styleUrls: ['./documentacion-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DocumentacionFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Evaluación de Desempeño';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  checked: boolean = true;
  documentacion: EventModel[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private eventsHttpService: EventsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Documentos', routerLink: ['/rrhh/documents']},
      {label: 'Añadir Documento'},
    ]);
    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Actualizar Documentacion';
    }
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    //this.getEvent();
  }


  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      documents: [null, [Validators.required]],
      active: [null, [Validators.required]],
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
    this.router.navigate(['/rrhh/documents']);
  }

  create(event: CreateEventDto): void {
    this.eventsHttpService.create(event).subscribe(event => {
      this.form.reset(event);
      this.back();
    });
  }


  getEvent(): void {
    this.isLoadingSkeleton = true;
    this.eventsHttpService.findOne(this.id).subscribe((event) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(event);
    });
  }

  update(event:UpdateEventDto): void {
    this.eventsHttpService.update(this.id, event).subscribe((event) => {
      this.form.reset(event);
      this.back()
    });
  }

  // Getters

  get documentsField() {
    return this.form.controls['document'];
  }

  get activeField() {
    return this.form.controls['active'];
  }
}
