import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {ActivatedRoute,Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/resources';
import {DocumentosHttpService, EvaluationsHttpService} from '@services/rrhh';
import {BreadcrumbService, CoreService, MessageService} from '@services/resources';
import {MenuItem} from "primeng/api";
import { AuthService } from '@services/auth';
import { DocumentosModel, SelectDocumentosDto } from '@models/rrhh/documentos.model';

@Component({
  selector: 'app-documentos-list',
  templateUrl: './documentos-list.component.html',
  styleUrls: ['./documentos-list.component.scss'],
})
export class DocumentosListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.documentHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedDocument: DocumentosModel[] = [];
  selectedDocumentos: SelectDocumentosDto = {};
  document:DocumentosModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private documentHttpService: DocumentosHttpService,
    private route: ActivatedRoute,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Documentos'}
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
    this.documentHttpService.findAll(page, this.search.value).subscribe((document) => this.document = document);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'user', header: 'Cedúla del Empleado'},
      {field: 'names', header: 'Nombre del Empleado'},
      // {field: 'observation', header: 'Observación'},
      // {field: 'noteF', header: 'Avance de Documentos'},
    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Revisar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedDocumentos.id)
            this.redirectEditForm(this.selectedDocumentos.id);
        },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedDocumentos.id)
            this.remove(this.selectedDocumentos.id);
        },
      },
    ];
  }

  paginate(document: any) {
    this.findAll(document.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/rrhh/documentos', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/rrhh/documentos', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.documentHttpService.remove(id).subscribe((document) => {
            this.document = this.document.filter(item => item.id !== document.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.documentHttpService.removeAll(this.selectedDocument).subscribe((document) => {
          this.selectedDocument.forEach(documentosDeleted => {
            this.document = this.document.filter(document => document.id !== documentosDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedDocument = [];
        });
      }
    });
  }

  selectEvaluation(document: DocumentosModel) {
    this.selectedDocumentos = document;
  }
}
