import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnModel, PaginatorModel } from '@models/resources';
import { PersonModel, SelectPersonDto} from '@models/rrhh/person.model';
import { AuthService } from '@services/auth';
import { BreadcrumbService, CoreService, MessageService } from '@services/resources';
import { PersonalInformationService } from '@services/rrhh';
import { MenuItem } from 'primeng/api';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-personal-list',
  templateUrl: './personal-list.component.html',
  styleUrls: ['./personal-list.component.css']
})
export class PersonalListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.personHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedPersons: PersonModel[] = [];
  selectedPerson: SelectPersonDto = {};
  persons: PersonModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private personHttpService: PersonalInformationService,
    private route: ActivatedRoute,
  ) {

    this.breadcrumbService.setItems([
      {label: 'Información Personal', routerLink: ['/rrhh/personal-info']},
      {label: 'Datos Personales'}
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
  }

  ngOnInit() {

    this.findAll();
  }


  redirectCreateForm() {
    this.router.navigate(['/rrhh/personal-info', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/rrhh/personal-info', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.personHttpService.remove(id).subscribe((person) => {
            this.persons = this.persons.filter(item => item.id !== person.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Actualizar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedPerson.id)
            this.redirectEditForm(this.selectedPerson.id);
        },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedPerson.id)
            this.remove(this.selectedPerson.id);
        },
      },
    ];
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'names', header: 'Nombres'},
      {field: 'lastNames', header: 'Apellidos'},
      {field: 'identificationCode', header: 'Cédula'},
      {field: 'city', header: 'Ciudad'},
      {field: 'gender', header: 'Género'},
      {field: 'birthdate', header: 'Fecha de Nacimiento'},
      {field: 'phone', header: 'teléfono'},
      {field: 'profession', header: 'Profesión'},
    ]
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.personHttpService.removeAll(this.selectedPersons).subscribe((person) => {
          this.selectedPersons.forEach(personDeleted => {
            this.persons = this.persons.filter(person => person.id !== personDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedPersons = [];
        });
      }
    });
  }
  checkState(person: PersonModel): string {
    if (person.isEnable) return 'success';

  return 'danger';
  }

  paginate(person: any) {
    this.findAll(person.page);
  }

  findAll(page: number = 0) {
    this.personHttpService.findAll(page, this.search.value).subscribe((person) => this.persons = person);
  }
  selectProyect(person: PersonModel) {
    this.selectedPerson = person;
  }
}
