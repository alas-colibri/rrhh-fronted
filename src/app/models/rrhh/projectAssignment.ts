export interface ProjectAssignmentModel {
  id: string;
  availableProjects: string;
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