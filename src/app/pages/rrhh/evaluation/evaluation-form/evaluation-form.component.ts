import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {BreadcrumbService, CoreService, MessageService} from '@services/resources';
import {OnExitInterface} from '@shared/interfaces';
import { EvaluationsHttpService } from '@services/rrhh';
import { CatalogueTypeEnum } from '@shared/enums';
import { format } from 'date-fns';
import { DateValidators } from '@shared/validators';
import { ProjectAssignmentModel } from '@models/rrhh/projectAssignment';
import { ProjectAssignmentHttpService } from '@services/rrhh/projectAssignment-http.service';
import { CreateEvaluationDto, UpdateEvaluationDto } from '@models/rrhh/evaluation.model';

@Component({
  selector: 'app-evaluation-form',
  templateUrl: './evaluation-form.component.html',
  styleUrls: ['./evaluation-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EvaluationFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Evaluación de Desempeño';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  checked: boolean = true;
  names: ProjectAssignmentModel[]=[];
  calificacion: any;
  selected1: any;
  selected2: any;
  selected3: any;
  selected4: any;
  selected5: any;
  selectedCalif: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private proyectAsHttpService: ProjectAssignmentHttpService,
    private evaluationsHttpService: EvaluationsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Preguntas', routerLink: ['/rrhh/questions']},
      {label: 'Añadir Pregunta'},
    ]);
    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Actualizar Pregunta';
    }
    this.calificacion = [
      { name: '0-10', code: 'Trrem' },
      { name: '20-40', code: 'Temr' },
      { name: '40-60', code: 'Indr' },
      { name: '60-80', code: 'Irnd' },
      { name: '80-100', code: 'Iyd' }
    ];
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.getEvaluation();
    this.getHolidayname();
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      name: [null, [Validators.required]],
      question1: [null, [Validators.required]],
      question2: [null, [Validators.required]],
      question3: [null, [Validators.required]],
      question4: [null],
      question5: [null],
      note1: [null, [Validators.required]],
      note2: [null, [Validators.required]],
      note3: [null, [Validators.required]],
      note4: [null],
      note5: [null],
      observation: [null, [Validators.required]],
      noteF: [null, [Validators.required]],
    });
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

  back(): void {
    this.router.navigate(['/rrhh/evaluation']);
  }

  create(evaluation: CreateEvaluationDto): void {
    this.evaluationsHttpService.create(evaluation).subscribe(evaluation => {
      this.form.reset(evaluation);
      this.back();
    });
  }


  getEvaluation(): void {
    this.isLoadingSkeleton = true;
    this.evaluationsHttpService.findOne(this.id).subscribe((evaluation) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(evaluation);
    });
  }

  update(evaluation:UpdateEvaluationDto): void {
    this.evaluationsHttpService.update(this.id, evaluation).subscribe((evaluation) => {
      this.form.reset(evaluation);
      this.back()
    });
  }

  getHolidayname(): void{
    this.isLoadingSkeleton = true;
    this.proyectAsHttpService.projectAssignment(CatalogueTypeEnum.PROYECT_ASSIGNMENT).subscribe((names) => {
        this.isLoadingSkeleton=false;
        this.names = names;
    })
  }

  // Getters

  get nameField() {
    return this.form.controls['name'];
  }

  get question1Field() {
    return this.form.controls['question1'];
  }

  get question2Field() {
    return this.form.controls['question2'];
  }

  get question3Field() {
    return this.form.controls['question3'];
  }

  get question4Field() {
    return this.form.controls['question4'];
  }

  get question5Field() {
    return this.form.controls['question5'];
  }

  get note1Field() {
    return this.form.controls['note1'];
  }

  get note2Field() {
    return this.form.controls['note2'];
  }

  get note3Field() {
    return this.form.controls['note3'];
  }

  get note4Field() {
    return this.form.controls['note4'];
  }

  get note5Field() {
    return this.form.controls['note5'];
  }

  get observationField() {
    return this.form.controls['observation'];
  }

  get noteFField() {
    return this.form.controls['noteF'];
  }
}
