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
  //names: ProjectAssignmentModel[]=[];
  typeProjectCharge: any;
  selectedTypeProjectChargeField: any;
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
    this.typeProjectCharge = [
      { name: 'Director del Proyecto', code: 'Dirc'},
      { name: 'Lider Tecnico', code: 'Lidr' },
      { name: 'Patrocinador Ejecutivo', code: 'Patro' },
      { name: 'Gerente Funcional', code: 'Geren' },
      { name: 'Miembro del Equipo del Proyecto', code: 'Miem' }

    ]



    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Cancelar proyecto';
    }
    this.cargo = [
      { name: 'Temporal', code: 'Tem' },
      { name: 'Indefinido', code: 'Ind' }
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
  }


  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      
      person: [null ],
      availableProjects: [null ],
      typeProjectCharge: [null],
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

  getProyectAsName(): void{
    this.isLoadingSkeleton = true;
    this.personHttpService.person(CatalogueTypeEnum.PERSON).subscribe((persons) => {
        this.isLoadingSkeleton=false;
        this.persons = persons;
    })
  }

  getProyectAsAvalaible(): void{
    this.isLoadingSkeleton = true;
    this.proyectHttpService.proyect(CatalogueTypeEnum.PROYECT_ASSIGNMENT).subscribe((availableProjects) => {
        this.isLoadingSkeleton=false;
        this.availableProjects = availableProjects;
    })
  }

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

  get typeProjectChargeField() {
    return this.form.controls['typeProjectCharge'];
  }

  get availableProjectsField() {
    return this.form.controls['availableProjects'];
  }

}

