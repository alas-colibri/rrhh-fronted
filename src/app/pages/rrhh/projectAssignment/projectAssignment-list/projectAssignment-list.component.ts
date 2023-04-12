import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { ColumnModel, PaginatorModel } from '@models/resources';
import {
  BreadcrumbService,
  CoreService,
  MessageService,
} from '@services/resources';
import { MenuItem } from 'primeng/api';
import { AuthService } from '@services/auth';
import {
  ProjectAssignmentModel,
  SelectProjectAssignmentDto,
} from '@models/rrhh/projectAssignment';
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
  selectedProjectAssignments: ProjectAssignmentModel[] = [];
  selectedProjectAssignment: SelectProjectAssignmentDto = {};
  projectAssignments: ProjectAssignmentModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private projectAssignmentHttpService: ProjectAssignmentHttpService,
    private route: ActivatedRoute
  ) {
    this.breadcrumbService.setItems([
      { label: 'Home estudiante', routerLink: ['/rrhh/projectAssignment'] },
      { label: 'Asignacion de Proyecto' },
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => (this.paginator = pagination));
    this.search.valueChanges
      .pipe(debounceTime(500))
      .subscribe((_) => this.findAll());
  }

  ngOnInit(): void {
    this.findAll();
  }

  checkState(projectAssignment: ProjectAssignmentModel): string {
    if (projectAssignment.departureDateProject) return 'success';

    return 'danger';
  }

  findAll(page: number = 0) {
    this.projectAssignmentHttpService
      .findAll(page, this.search.value)
      .subscribe(
        (projectAssignments) => this.projectAssignments = projectAssignments);
  }

  getColumns(): ColumnModel[] {
    return [
      { field: 'namePerson', header: 'Nombre del Trabajador' },
      { field: 'availableProjects', header: 'Proyectos Disponibles' },
      { field: 'projectCharge', header: 'Cargo del Proyecto' },
      { field: 'dateEntryFoundation', header: 'Fecha de ingreso a la fundacion' },
      { field: 'dateEntryProject', header: 'Fecha de ingreso al proyecto' },
      { field: 'departureDateProject', header: 'Fecha de salida al proyecto' },
      { field: 'isEnable', header: 'Estado' },
    ];
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
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.projectAssignmentHttpService
          .remove(id)
          .subscribe((projectAssignment) => {
            this.projectAssignments = this.projectAssignments.filter(
              (item) => item.id !== projectAssignment.id
            );
            this.paginator.totalItems--;
          });
      }
    });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.projectAssignmentHttpService
          .removeAll(this.selectedProjectAssignments)
          .subscribe((projectAssignment) => {
            this.selectedProjectAssignments.forEach(
              (projectAssignmentDeleted) => {
                this.projectAssignments = this.projectAssignments.filter(
                  (event) => event.id !== projectAssignmentDeleted.id
                );
                this.paginator.totalItems--;
              }
            );
            this.selectedProjectAssignments = [];
          });
      }
    });
  }

  selectProjectAssignment(projectAssignment: ProjectAssignmentModel) {
    this.selectedProjectAssignment = projectAssignment;
  }
}
