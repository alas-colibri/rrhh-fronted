import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {ActivatedRoute,Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/resources';
import {EventsHttpService} from '@services/rrhh';
import {BreadcrumbService, CoreService, MessageService} from '@services/resources';
import {MenuItem} from "primeng/api";
import { EventModel, SelectEventDto } from '@models/rrhh';
import { AuthService } from '@services/auth';

@Component({
  selector: 'app-evaluation-list',
  templateUrl: './evaluation-list.component.html',
  styleUrls: ['./evaluation-list.component.scss'],
})
export class EvaluationListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.eventsHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedEvents: EventModel[] = [];
  selectedEvent: SelectEventDto = {};
  events: EventModel[] = [];
  actionButtons: MenuItem[] = [];
  questions: EventModel[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private eventsHttpService: EventsHttpService,
    private route: ActivatedRoute,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Evaluación Continúa'}
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
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
}
