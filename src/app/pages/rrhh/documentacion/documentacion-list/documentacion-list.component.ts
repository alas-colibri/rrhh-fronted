import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {ActivatedRoute,Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/resources';
import {EvaluationsHttpService, EventsHttpService} from '@services/rrhh';
import {BreadcrumbService, CoreService, MessageService} from '@services/resources';
import {MenuItem} from "primeng/api";
import { CreateEventDto, EventModel, SelectEventDto } from '@models/rrhh';
import { AuthService } from '@services/auth';
import { CreateEvaluationDto, UpdateEvaluationDto } from '@models/rrhh/evaluation.model';
import { CalificacionModel } from '@models/rrhh/calificacion.model';
import { CreateDocumentacionDto, UpdateDocumentacionDto } from '@models/rrhh/documentacion.models';
import { DocumentacionHttpService } from '@services/rrhh/documentacion-http.service';

@Component({
  selector: 'app-documentacion-list',
  templateUrl: './documentacion-list.component.html',
  styleUrls: ['./documentacion-list.component.scss'],
})
export class DocumentacionListComponent implements OnInit {
  id: string = '';
  columns: ColumnModel[];
  form: UntypedFormGroup = this.newForm;
  loaded$ = this.coreService.loaded$;
  pagination$ = this.eventsHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedEvents: EventModel[] = [];
  selectedEvent: SelectEventDto = {};
  events: EventModel[] = [];
  actionButtons: MenuItem[] = [];
  documentacion: EventModel[] = [];
  calificacion: CalificacionModel[] = [];
  selectedCali: any;

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private eventsHttpService: EventsHttpService,
    private documentacionHttpService: DocumentacionHttpService,
    private route: ActivatedRoute,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Documentacion'}
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
    this.calificacion = [
      { name: '20-40', code: 'Tem' },
      { name: '40-60', code: 'Ind' },
      { name: '60-80', code: 'Irnd' },
      { name: '80-100', code: 'Inyd' }
    ];
  }

  ngOnInit(): void {
    //this.findAll();
    this.findAllQuestions();
  }

  checkState(event: EventModel): string {
    if (event.active) return 'success';

  return 'danger';
  }

  findAll(page: number = 0) {
    this.eventsHttpService.findAll(page, this.search.value).subscribe((events) => this.events = events);
  }

  findAllQuestions(page: number = 0) {
    this.eventsHttpService
    .findAll(page, this.search.value)
    .subscribe((events) => this.events = events.filter((events)=>events.active==true));
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      results: [null, [Validators.required]],
    });
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'documents', header: 'documentos'},
    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Update',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedEvent.id)
            this.redirectEditForm(this.selectedEvent.id);
        },
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedEvent.id)
            this.remove(this.selectedEvent.id);
        },
      },
    ];
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

  create(documentacion: CreateDocumentacionDto): void {
    this.documentacionHttpService.create(documentacion).subscribe(documentacion => {
      this.form.reset(documentacion);
      this.back();
    });
  }

  update(documentacion:UpdateDocumentacionDto): void {
    this.documentacionHttpService.update(this.id, documentacion).subscribe((documentacion) => {
      this.form.reset(documentacion);
      this.back()
    });
  }

  paginate(event: any) {
    this.findAll(event.page);
  }
  back(): void {
    this.router.navigate(['/rrhh/rrhh-home']);
  }

  redirectCreateForm() {
    this.router.navigate(['/rrhh/documents', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/rrhh/documents', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.eventsHttpService.remove(id).subscribe((event) => {
            this.events = this.events.filter(item => item.id !== event.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.eventsHttpService.removeAll(this.selectedEvents).subscribe((events) => {
          this.selectedEvents.forEach(eventDeleted => {
            this.events = this.events.filter(event => event.id !== eventDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedEvents = [];
        });
      }
    });
  }

  selectEvent(event: EventModel) {
    this.selectedEvent = event;
  }
  /////
  get resultsField() {
    return this.form.controls['results'];
  }

  get forField() {
    return this.form.controls['for'];
  }
}
