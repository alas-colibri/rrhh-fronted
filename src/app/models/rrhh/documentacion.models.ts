import { PersonModel } from "./person.model";

export interface DocumentacionModel {
  id: string;
  person: PersonModel[];
  results: string[];
}

export interface CreateDocumentacionDto extends Omit<DocumentacionModel, 'id'> {
}

export interface UpdateDocumentacionDto extends Partial<Omit<DocumentacionModel, 'id'>> {
}

export interface ReadDocumentacionDto extends Partial<DocumentacionModel> {
}

export interface SelectDocumentacionDto extends Partial<DocumentacionModel> {
}
