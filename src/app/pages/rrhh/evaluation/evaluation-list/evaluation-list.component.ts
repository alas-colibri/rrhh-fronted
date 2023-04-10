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

@Component({
  selector: 'app-evaluation-list',
  templateUrl: './evaluation-list.component.html',
  styleUrls: ['./evaluation-list.component.scss'],
})
export class EvaluationListComponent implements OnInit {
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
  questions: EventModel[] = [];
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
    private evaluationsHttpService: EvaluationsHttpService,
    private route: ActivatedRoute,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Evaluación Continúa'}
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
      {field: 'question', header: 'Preguntas'},
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

  create(evaluation: CreateEvaluationDto): void {
    this.evaluationsHttpService.create(evaluation).subscribe(evaluation => {
      this.form.reset(evaluation);
      this.back();
    });
  }

  update(evaluation:UpdateEvaluationDto): void {
    this.evaluationsHttpService.update(this.id, evaluation).subscribe((evaluation) => {
      this.form.reset(evaluation);
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
    this.router.navigate(['/rrhh/questions', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/rrhh/questions', id]);
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
