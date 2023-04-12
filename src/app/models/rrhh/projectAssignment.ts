import { PersonModel } from './person.model';
import { ProyectModel } from './proyect.model';
export interface ProjectAssignmentModel {
  id: string;
  persons: PersonModel[];
  availableProjects: ProyectModel[];
  projectCharge: string;
  dateEntryFoundation: Date;
  dateEntryProject: Date;
  departureDateProject: Date;

}

export interface CreateProjectAssignmentDto extends Omit<ProjectAssignmentModel, 'id'> {
}

export interface UpdateProjectAssignmentDto extends Partial<Omit<ProjectAssignmentModel, 'id'>>{
}

export interface ReadProjectAssignmentDto extends Partial<ProjectAssignmentModel> {
}

export interface SelectProjectAssignmentDto extends Partial<ProjectAssignmentModel> {
}
