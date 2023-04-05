import { ProjectAssignmentModel } from "./projectAssignment";

export interface HolidayModel {
  id: string;
  names: ProjectAssignmentModel[];
  cedula: string;
  assigProject: string;
  typeHoliday: string;
  startDate: Date;
  endDate: Date;
}

export interface CreateHolidayDto extends Omit<HolidayModel, 'id'> {
}

export interface UpdateHolidayDto extends Partial<Omit<HolidayModel, 'id'>> {
}

export interface ReadHolidayDto extends Partial<HolidayModel> {
}

export interface SelectHolidayDto extends Partial<HolidayModel> {
}
