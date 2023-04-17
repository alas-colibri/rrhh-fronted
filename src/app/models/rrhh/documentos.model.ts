import { PersonModel } from "./person.model";
import { ProjectAssignmentModel } from "./projectAssignment";

export interface DocumentosModel {
  id: string;
  user: PersonModel;
  // question1: string;
  // question2: string;
  // question3: string;
  // question4: string;
  // question5: string;
  note1: boolean;
  note2: boolean;
  note3: boolean;
  note4: boolean;
  note5: boolean;
}

export interface CreateDocumentosDto extends Omit<DocumentosModel, 'id'> {
}

export interface UpdateDocumentosDto extends Partial<Omit<DocumentosModel, 'id'>> {
}

export interface ReadDocumentosDto extends Partial<DocumentosModel> {
}

export interface SelectDocumentosDto extends Partial<DocumentosModel> {
}
