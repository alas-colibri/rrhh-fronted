import { PersonModel } from "./person.model";

export interface EvaluationModel {
  id: string;
  person: PersonModel[];
  results: string[];
}

export interface CreateEvaluationDto extends Omit<EvaluationModel, 'id'> {
}

export interface UpdateEvaluationDto extends Partial<Omit<EvaluationModel, 'id'>> {
}

export interface ReadEvaluationDto extends Partial<EvaluationModel> {
}

export interface SelectEvaluationDto extends Partial<EvaluationModel> {
}
