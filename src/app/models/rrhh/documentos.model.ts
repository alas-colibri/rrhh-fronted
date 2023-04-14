import { PersonModel } from "./person.model";
import { ProjectAssignmentModel } from "./projectAssignment";

export interface DocumentosModel {
  id: string;
  name: PersonModel;
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

export interface CreateDocumentosDto extends Omit<DocumentosModel, 'id'> {
}

export interface UpdateDocumentosDto extends Partial<Omit<DocumentosModel, 'id'>> {
}

export interface ReadDocumentosDto extends Partial<DocumentosModel> {
}

export interface SelectDocumentosDto extends Partial<DocumentosModel> {
}
