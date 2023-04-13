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
import { EvaluationsHttpService, EventsHttpService, PersonalInformationService } from '@services/rrhh';
import { CreateEventDto, EventModel, UpdateEventDto } from '@models/rrhh';
import { CatalogueTypeEnum } from '@shared/enums';
import { format } from 'date-fns';
import { DateValidators } from '@shared/validators';
import { PersonModel } from '@models/rrhh/person.model';
import { ProjectAssignmentHttpService } from '@services/rrhh/projectAssignment-http.service';
import { UpdateDocumentacionDto } from '@models/rrhh/documentacion.models';
import { DocumentacionHttpService } from '@services/rrhh/documentacion-http.service';

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
  names: PersonModel[]=[];
  calificacion: any;
  selected1: any;
  selected2: any;
  selected3: any;
  selected4: any;
  selected5: any;
  selectedCalif: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private eventsHttpService: EventsHttpService,
    private proyectAsHttpService: ProjectAssignmentHttpService,
    private documentacionHttpService: DocumentacionHttpService,
    private personHttpService: PersonalInformationService,
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
    this.getDocumentacion();
    this.getHolidayname();
  }


  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      name: [null, [Validators.required]],
      question1: [null, [Validators.required]],
      question2: [null, [Validators.required]],
      question3: [null, [Validators.required]],
      question4: [null],
      question5: [null],
      note1: [null, [Validators.required]],
      note2: [null, [Validators.required]],
      note3: [null, [Validators.required]],
      note4: [null],
      note5: [null],
      observation: [null, [Validators.required]],
      noteF: [null, [Validators.required]],
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


  getDocumentacion(): void {
    this.isLoadingSkeleton = true;
    this.eventsHttpService.findOne(this.id).subscribe((documentacion) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(documentacion);
    });
  }

  update(documentacion:UpdateDocumentacionDto): void {
    this.documentacionHttpService.update(this.id, documentacion).subscribe((documentacion) => {
      this.form.reset(documentacion);
      this.back()
    });
  }

  getHolidayname(): void{
    this.isLoadingSkeleton = true;
    this.personHttpService.person(CatalogueTypeEnum.PERSON).subscribe((names) => {
        this.isLoadingSkeleton=false;
        this.names = names;
    })
  }

  // Getters

  get nameField() {
    return this.form.controls['name'];
  }

  get question1Field() {
    return this.form.controls['question1'];
  }

  get question2Field() {
    return this.form.controls['question2'];
  }

  get question3Field() {
    return this.form.controls['question3'];
  }

  get question4Field() {
    return this.form.controls['question4'];
  }

  get question5Field() {
    return this.form.controls['question5'];
  }

  get note1Field() {
    return this.form.controls['note1'];
  }

  get note2Field() {
    return this.form.controls['note2'];
  }

  get note3Field() {
    return this.form.controls['note3'];
  }

  get note4Field() {
    return this.form.controls['note4'];
  }

  get note5Field() {
    return this.form.controls['note5'];
  }

  get observationField() {
    return this.form.controls['observation'];
  }

  get noteFField() {
    return this.form.controls['noteF'];
  }
}
