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
import { ProjectAssignmentModel, SelectProjectAssignmentDto } from '@models/rrhh/projectAssignment';
import { ProjectAssignmentHttpService } from '@services/rrhh/projectAssignment-http.service';

@Component({
  selector: 'app-projectAssignment-list',
  templateUrl: './projectAssignment-list.component.html',
  styleUrls: ['./projectAssignment-list.component.scss'],
})
export class ProjectAssignmentListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.projectAssignmentHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedprojectAssignments: ProjectAssignmentModel[] = [];
  selectedprojectAssignment: SelectProjectAssignmentDto = {};
  projectAssignment: ProjectAssignmentModel[] = [];
  actionButtons: MenuItem[] = [];
  /*projectAssignmentHttpService: any;*/
  selectedProjectAssignment: any;


  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private projectAssignmentHttpService: ProjectAssignmentHttpService,
    private route: ActivatedRoute,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Home estudiante', routerLink: ['/rrhh/projectAssignment']},
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
/*
  checkState(projectAssignment: ProjectAssignmentModel): string {
    if (projectAssignment.isEnable) return 'success';

  return 'danger';
  }*/

  findAll(page: number = 0) {
    this.projectAssignmentHttpService.findAll(page, this.search.value).subscribe((projectAssignment: ProjectAssignmentModel[]) => this.projectAssignment = projectAssignment);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'availableProjects', header: 'Proyecto Disponibles'},
      {field: 'projectCharge', header: 'Cargo de Proyecto'},
      {field: 'dateEntryFoundation', header: 'Fecha de ingreso a la fundacion'},
      {field: 'dateEntryProject', header: 'Fecha de ingreso al proyecto'},
      {field: 'departureDateProject', header: 'Fecha de salida al proyecto'},
    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Update',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedProjectAssignment.id)
            this.redirectEditForm(this.selectedProjectAssignment.id);
        },
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedProjectAssignment.id)
            this.remove(this.selectedProjectAssignment.id);
        },
      },
    ];
  }

  paginate(projectAssignment: any) {
    this.findAll(projectAssignment.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/rrhh/projectAssignment', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/rrhh/projectAssignment', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.projectAssignmentHttpService.remove(id).subscribe((projectAssignment) => {
            this.projectAssignment = this.projectAssignment.filter(item => item.id !== projectAssignment.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.projectAssignmentHttpService.removeAll(this.selectedProjectAssignment).subscribe((projectAssignment) => {
          this.selectedProjectAssignment.forEach((projectAssignmentDeleted: { id: string; }) => {
            this.projectAssignment = this.projectAssignment.filter(event => event.id !== projectAssignmentDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedProjectAssignment = [];
        });
      }
    });
  }

  selectProjectAssignment(projectAssignment: ProjectAssignmentModel) {
    this.selectedProjectAssignment = projectAssignment;
  }
}
