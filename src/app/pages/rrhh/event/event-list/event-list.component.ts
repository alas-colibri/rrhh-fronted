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
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.eventsHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedEvents: EventModel[] = [];
  selectedEvent: SelectEventDto = {};
  events: EventModel[] = [];
  actionButtons: MenuItem[] = [];

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
      {label: 'Convocatorias', routerLink: ['/rrhh/events']},
      {label: 'Asignacion de fases'}
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
  }

  ngOnInit(): void {
    this.findAll();
  }

  checkState(event: EventModel): string {
    if (event.isEnable) return 'success';

  return 'danger';
  }

  findAll(page: number = 0) {
    this.eventsHttpService.findAll(page, this.search.value).subscribe((events) => this.events = events);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'sort', header: 'Orden'},
      {field: 'startDate', header: 'Fecha de inicio'},
      {field: 'endDate', header: 'Fecha fin'},
      {field: 'isEnable', header: 'Estado'},
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

  redirectCreateForm() {
    this.router.navigate(['/rrhh/events', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/rrhh/events', id]);
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
