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
import { CreateDocumentacionDto, DocumentacionModel, SelectDocumentacionDto, UpdateDocumentacionDto } from '@models/rrhh/documentacion.models';
import { DocumentacionHttpService } from '@services/rrhh/documentacion-http.service';

@Component({
  selector: 'app-documentacion-list',
  templateUrl: './documentacion-list.component.html',
  styleUrls: ['./documentacion-list.component.scss'],
})
export class DocumentacionListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.documentacionHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedDocumento: DocumentacionModel[] = [];
  selectedDocumentacion: SelectDocumentacionDto = {};
  documento: DocumentacionModel[] = [];
  actionButtons: MenuItem[] = [];
  evas: DocumentacionModel[] = [];


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
  }

  ngOnInit(): void {
    this.findAll();

  }

  findAll(page: number = 0) {
    this.documentacionHttpService.findAll(page, this.search.value).subscribe((documento) => this.documento = documento);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'name', header: 'Cedúla del Empleado'},
      {field: 'names', header: 'Nombre del Empleado'},
      {field: 'observation', header: 'Observación'},
      {field: 'noteF', header: 'Nota de desempeño'},
    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Revisar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedDocumentacion.id)
            this.redirectEditForm(this.selectedDocumentacion.id);
        },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedDocumentacion.id)
            this.remove(this.selectedDocumentacion.id);
        },
      },
    ];
  }

  paginate(evaluation: any) {
    this.findAll(evaluation.page);
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
          this.documentacionHttpService.remove(id).subscribe((documentacion) => {
            this.documento = this.documento.filter(item => item.id !== documentacion.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.documentacionHttpService.removeAll(this.selectedDocumento).subscribe((evaluations) => {
          this.selectedDocumento.forEach(evaluationDeleted => {
            this.documento = this.documento.filter(documento => documento.id !== documentoDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedDocumento = [];
        });
      }
    });
  }

  selectDocumentacion(documento: DocumentacionModel) {
    this.selectedDocumentacion = documento;
  }
}

