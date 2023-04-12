import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import {map} from 'rxjs/operators';
import { ServerResponse } from '@models/http-response';
import { CreatePersonDto, PersonModel, UpdatePersonDto } from '@models/rrhh/person.model';
import { CoreService, MessageService } from '@services/resources';
import { BehaviorSubject, Observable } from 'rxjs';
import { PaginatorModel } from '@models/resources';
import { CatalogueTypeEnum } from '@shared/enums';

@Injectable({
  providedIn: 'root'
})
export class PersonalInformationService {
  API_URL = `${environment.API_URL}/person`;
  private pagination = new BehaviorSubject<PaginatorModel>(this.coreService.paginator);
  public pagination$ = this.pagination.asObservable();


constructor(
  private coreService: CoreService,
  private httpClient: HttpClient,
  private messageService: MessageService,
) {

 }

 create(payload: CreatePersonDto): Observable<PersonModel> {
  const url = `${this.API_URL}`;
  console.log(url)

  this.coreService.showLoad();
  return this.httpClient.post<ServerResponse>(url, payload).pipe(
    map((response) => {
      this.coreService.hideLoad();
      this.messageService.success(response).then();
      return response.data;
    })
  );
}

person(type: CatalogueTypeEnum): Observable<PersonModel[]> {
  const url = `${this.API_URL}/catalogue`;
  const params = new HttpParams().append('type', type);
  this.coreService.showLoad();
  return this.httpClient.get<ServerResponse>(url, {params}).pipe(
    map(response => {
      this.coreService.hideLoad();
      return response.data
    })
  );
}

update(id: string, payload: UpdatePersonDto): Observable<PersonModel> {
  const url = `${this.API_URL}/${id}`;

  this.coreService.showLoad();
  return this.httpClient.put<ServerResponse>(url, payload).pipe(
    map(response => {
      this.coreService.hideLoad();
      this.messageService.success(response).then();
      return response.data;
    })
  );
}

findAll(page: number = 0, search: string = ''): Observable<PersonModel[]> {
  const url = this.API_URL;

  const headers = new HttpHeaders().append('pagination', 'true');
  const params = new HttpParams()
    .append('page', page)
    .append('search', search);

  this.coreService.showLoad();
  return this.httpClient.get<ServerResponse>(url, {headers, params}).pipe(
    map((response) => {
      this.coreService.hideLoad();
      if (response.pagination) {
        this.pagination.next(response.pagination);
      }
      return response.data;
    })
  );
}

remove(id: string): Observable<PersonModel> {
  const url = `${this.API_URL}/${id}`;

  this.coreService.showLoad();
  return this.httpClient.delete<ServerResponse>(url).pipe(
    map((response) => {
      this.coreService.hideLoad();
      this.messageService.success(response).then();
      return response.data;
    })
  );
}

removeAll(person: PersonModel[]): Observable<PersonModel[]> {
  const url = `${this.API_URL}/remove-all`;

  this.coreService.showLoad();
  return this.httpClient.patch<ServerResponse>(url, person).pipe(
    map((response) => {
      this.coreService.hideLoad();
      this.messageService.success(response).then();
      return response.data;
    })
  );
}


findOne(id: string): Observable<PersonModel> {
  const url = `${this.API_URL}/${id}`;

  this.coreService.showLoad();
  return this.httpClient.get<ServerResponse>(url).pipe(
    map(response => {
      this.coreService.hideLoad();
      return response.data;
    })
  );
}

}
