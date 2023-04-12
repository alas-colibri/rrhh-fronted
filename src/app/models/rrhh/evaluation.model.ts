import { PersonModel } from "./person.model";

export interface EvaluationModel {
  id: string;
  name: PersonModel[];
  question1: string;
  question2: string;
  question3: string;
  question4: string;
  question5: string;
  note1: string;
  note2: string;
  note3: string;
  note4: string;
  note5: string;
  observation: string;
  noteF: string;
}

export interface CreateEvaluationDto extends Omit<EvaluationModel, 'id'> {
}

export interface UpdateEvaluationDto extends Partial<Omit<EvaluationModel, 'id'>> {
}

export interface ReadEvaluationDto extends Partial<EvaluationModel> {
}

export interface SelectEvaluationDto extends Partial<EvaluationModel> {
}
