import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {ActivatedRoute,Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/resources';
import {EvaluationsHttpService} from '@services/rrhh';
import {BreadcrumbService, CoreService, MessageService} from '@services/resources';
import {MenuItem} from "primeng/api";
import { AuthService } from '@services/auth';
import { EvaluationModel, SelectEvaluationDto } from '@models/rrhh/evaluation.model';

@Component({
  selector: 'app-evaluation-list',
  templateUrl: './evaluation-list.component.html',
  styleUrls: ['./evaluation-list.component.scss'],
})
export class EvaluationListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.evaluationsHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedEvaluations: EvaluationModel[] = [];
  selectedEvaluation: SelectEvaluationDto = {};
  evaluations: EvaluationModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
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
  }

  ngOnInit(): void {
    this.findAll();
    }

  findAll(page: number = 0) {
    this.evaluationsHttpService.findAll(page, this.search.value).subscribe((evaluations) => this.evaluations = evaluations);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'persons', header: 'Nombre del Trabajador'},
      {field: 'name', header: 'Proyecto Asignado'},
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
          if (this.selectedEvaluation.id)
            this.redirectEditForm(this.selectedEvaluation.id);
        },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedEvaluation.id)
            this.remove(this.selectedEvaluation.id);
        },
      },
    ];
  }

  paginate(evaluation: any) {
    this.findAll(evaluation.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/rrhh/evaluation', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/rrhh/evaluation', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.evaluationsHttpService.remove(id).subscribe((evaluation) => {
            this.evaluations = this.evaluations.filter(item => item.id !== evaluation.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.evaluationsHttpService.removeAll(this.selectedEvaluations).subscribe((evaluations) => {
          this.selectedEvaluations.forEach(evaluationDeleted => {
            this.evaluations = this.evaluations.filter(evaluations => evaluations.id !== evaluationDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedEvaluations = [];
        });
      }
    });
  }

  selectEvaluation(evaluation: EvaluationModel) {
    this.selectedEvaluation = evaluation;
  }
}
