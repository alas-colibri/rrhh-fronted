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
import { PersonModel } from '@models/rrhh/person.model';
import { ProyectModel } from '@models/rrhh/proyect.model';
import { PersonalInformationService, ProyectHttpService } from '@services/rrhh';

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
  persons: PersonModel[]=[];
  availableProjects: ProyectModel[]=[];
  cargo: any;
  selectcargo: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private projectAssignmentHttpService: ProjectAssignmentHttpService,
    private personHttpService: PersonalInformationService,
    private proyectHttpService: ProyectHttpService,
  ) {
    this.breadcrumbService.setItems([
      { label: 'Asignar proyecto', routerLink: ['/rrhh/projectAssignment'] },

    ]);
    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Cancelar proyecto';
    }
    this.cargo = [
      { name: 'Líder', code: 'Tem' },
      { name: 'Asesor', code: 'Ind' }
    ];
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
   this.getProyectAsName();
   this.getProyectAsAvalaible();
   this.getProjectAssignment();
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      person: [null ],
      availableProject: [null ],
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
      this.getProyectAsName();
      this.getProyectAsAvalaible();
      let dateEntryProject = format(new Date, 'dd/MM/yyyy');
      this.dateEntryProjectField.setValue(dateEntryProject);
      this.form.patchValue(projectAssignment);
    });
  }

  update(projectAssignment: UpdateProjectAssignmentDto): void {
    this.projectAssignmentHttpService.update(this.id, projectAssignment).subscribe((projectAssignment) => {
      this.form.reset(projectAssignment);
      this.back()
    });
  }

  getProyectAsName(): void{
    this.isLoadingSkeleton = true;
    this.personHttpService.person(CatalogueTypeEnum.PERSON).subscribe((persons) => {
        this.isLoadingSkeleton=false;
        this.persons = persons;
    })
  }

  getProyectAsAvalaible(): void{
    this.isLoadingSkeleton = true;
    this.proyectHttpService.proyect(CatalogueTypeEnum.PROYECT_ASSIGNMENT)
    .subscribe((availableProjects) => (this.availableProjects = availableProjects.filter((availableProjects)=>availableProjects.isEnable==true)))
    //     this.isLoadingSkeleton=false;
    //     this.availableProjects = availableProjects;
    // })
  }

  // loadNameModality(): void {
  //   this.modalitiesHttpService
  //     .modality(ModalityTypeEnum.PLANNING_NAMES)
  //     .subscribe((nameModalities) => (this.nameModalities = nameModalities.filter((modalities)=>modalities.state==true)));
  // }

  // Getters

  get personField() {
    return this.form.controls['person'];
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

  get availableProjectField() {
    return this.form.controls['availableProject'];
  }
}

