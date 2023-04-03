export interface CatalogueTypeModel {
  name: string;
  type: string;
}

export interface CreateCatalogueTypeDto extends Omit<CatalogueTypeModel, 'id'> {
}

export interface UpdateCatalogueTypeDto extends Partial<Omit<CatalogueTypeModel, 'id'>> {
}

export interface SelectCatalogueTypeDto extends Partial<CatalogueTypeModel> {
}
