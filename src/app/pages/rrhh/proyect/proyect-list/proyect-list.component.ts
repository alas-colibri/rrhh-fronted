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
import { ProyectModel, SelectProyectDto } from '@models/rrhh/proyect.model';
import { ProyectHttpService } from '@services/rrhh/proyect-http.service';

@Component({
  selector: 'app-proyect-list',
  templateUrl: './proyect-list.component.html',
  styleUrls: ['./proyect-list.component.scss'],
})
export class ProyectListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.proyectHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedProyects: ProyectModel[] = [];
  selectedProyect: SelectProyectDto = {};
  proyect: ProyectModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private proyectHttpService: ProyectHttpService,
    private route: ActivatedRoute,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Home estudiante', routerLink: ['/rrhh/proyect']},
      {label: 'Asignacion de proyecto'}
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
  }

  ngOnInit(): void {
    this.findAll();
  }

  checkState(proyect: ProyectModel): string {
    if (proyect.isEnable) return 'success';

  return 'danger';
  }

  findAll(page: number = 0) {
    this.proyectHttpService.findAll(page, this.search.value).subscribe((proyect) => this.proyect = proyect);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'nameProyect', header: 'Nombre del proyecto'},
      {field: 'descripcionProyect', header: 'Tipo del proyecto'},
      {field: 'startDate', header: 'Fecha de inicio'},
      {field: 'endDate', header: 'Fecha fin'},
      {field: 'isEnable', header: 'Estado'},
    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedProyect.id)
            this.redirectEditForm(this.selectedProyect.id);
        },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedProyect.id)
            this.remove(this.selectedProyect.id);
        },
      },
    ];
  }

  paginate(proyect: any) {
    this.findAll(proyect.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/rrhh/proyect', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/rrhh/proyect', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.proyectHttpService.remove(id).subscribe((proyect) => {
            this.proyect = this.proyect.filter(item => item.id !== proyect.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.proyectHttpService.removeAll(this.selectedProyects).subscribe((proyect) => {
          this.selectedProyects.forEach(proyectDeleted => {
            this.proyect = this.proyect.filter(event => event.id !== proyectDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedProyects = [];
        });
      }
    });
  }

  selectProyect(proyect: ProyectModel) {
    this.selectedProyect = proyect;
  }
}
