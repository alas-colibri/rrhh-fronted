import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService, CoreService, MessageService } from '@services/resources';
import { OnExitInterface } from '@shared/interfaces';
import { CatalogueTypeEnum } from '@shared/enums';
import { format } from 'date-fns';
import { DateValidators } from '@shared/validators';
import { CreateProjectAssignmentDto, UpdateProjectAssignmentDto } from '@models/rrhh/projectAssignment';
import { ProjectAssignmentHttpService } from '@services/rrhh/projectAssignment-http.service';

@Component({
  selector: 'app-projectAssignment-form',
  templateUrl: './projectAssignment-form.component.html',
  styleUrls: ['./projectAssignment-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})


export class ProjectAssignmentFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Asignar Proyecto';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  checked: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private projectAssignmentHttpService: ProjectAssignmentHttpService,

  ) {
    this.breadcrumbService.setItems([
      { label: 'Asignar proyecto', routerLink: ['/rrhh/projectAssignment'] },

    ]);
    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Cancelar proyecto';
    }
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
  //  this.getProjectAssignment();
  }


  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      availableProjects: [null ],
      projectCharge: [null],
      dateEntryFoundation: [null],
      dateEntryProject: [null],
      departureDateProject: [null],



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
    this.router.navigate(['/rrhh/projectAssignment']);
  }

  create(projectAssignment: CreateProjectAssignmentDto): void {
    this.projectAssignmentHttpService.create(projectAssignment).subscribe(projectAssignment => {
      this.form.reset(projectAssignment);
      this.back();
    });
  }


  getProjectAssignment(): void {
    this.isLoadingSkeleton = true;
    this.projectAssignmentHttpService.findOne(this.id).subscribe((projectAssignment) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(projectAssignment);
    });
  }

  update(projectAssignment: UpdateProjectAssignmentDto): void {
    this.projectAssignmentHttpService.update(this.id, projectAssignment).subscribe((projectAssignment) => {
      this.form.reset(projectAssignment);
      this.back()
    });
  }

  // Getters

  get namePersonField() {
    return this.form.controls['namePerson'];
  }

  get departureDateProjectField() {
    return this.form.controls['departureDateProject'];
  }

  get dateEntryFoundationField() {
    return this.form.controls['dateEntryFoundation'];
  }

  get dateEntryProjectField() {
    return this.form.controls['dateEntryProject'];
  }

  get projectChargeField() {
    return this.form.controls['projectCharge'];
  }

  get availableProjectsField() {
    return this.form.controls['availableProjects'];
  }

  /*get descripcionProyectField() {
    return this.form.controls['descripcionProyect'];
  }

  get tipodeProyectField() {
    return this.form.controls['tipodeProyect'];
  }
*/
}

