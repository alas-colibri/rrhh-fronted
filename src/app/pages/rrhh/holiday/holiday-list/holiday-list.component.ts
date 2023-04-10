import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnModel, PaginatorModel } from '@models/resources';
import { HolidayModel, SelectHolidayDto } from '@models/rrhh/holiday.model';
import { AuthService } from '@services/auth';
import { BreadcrumbService, CoreService, MessageService } from '@services/resources';
import { HolidayHttpService } from '@services/rrhh/holiday-http.service';
import { MenuItem} from 'primeng/api';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-holiday-list',
  templateUrl: './holiday-list.component.html',
  styleUrls: ['./holiday-list.component.scss']
})
export class HolidayListComponent implements OnInit {

  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.holidayHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedHolidays: HolidayModel[] = [];
  selectedHoliday: SelectHolidayDto = {};
  holiday: HolidayModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private holidayHttpService: HolidayHttpService,
    private route: ActivatedRoute,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Home', routerLink: ['/rrhh/holiday']},
      {label: 'Asignacion de vacaciones'}
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
  }

  ngOnInit(): void {
    this.findAll();
  }

  /*checkState(holiday: HolidayModel): string {
    if (holiday.isEnable) return 'success';

  return 'danger';
  }*/

  findAll(page: number = 0) {
    this.holidayHttpService.findAll(page, this.search.value).subscribe((holiday) => this.holiday = holiday);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'availableProjects', header: 'Nombre del Trabajador'},
      {field: 'names', header: 'Cedula del trabajdor'},
      {field: 'names', header: 'Proyecto Asignado'},
      {field: 'typeHoliday', header: 'Tipo de Vacaciones'},
      {field: 'startDate', header: 'Fecha de Inicio'},
      {field: 'endDate', header: 'Fecha Fin'},
    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Update',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedHoliday.id)
            this.redirectEditForm(this.selectedHoliday.id);
        },
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedHoliday.id)
            this.remove(this.selectedHoliday.id);
        },
      },
    ];
  }

  paginate(holiday: any) {
    this.findAll(holiday.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/rrhh/holiday', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/rrhh/holiday', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.holidayHttpService.remove(id).subscribe((holiday) => {
            this.holiday = this.holiday.filter(item => item.id !== holiday.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.holidayHttpService.removeAll(this.selectedHolidays).subscribe((holiday) => {
          this.selectedHolidays.forEach(holidayDeleted => {
            this.holiday = this.holiday.filter(event => event.id !== holidayDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedHolidays = [];
        });
      }
    });
  }

  selectHoliday(holiday: HolidayModel) {
    this.selectedHoliday = holiday;
  }

}
