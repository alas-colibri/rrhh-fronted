import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import {map} from 'rxjs/operators';
import { ServerResponse } from '@models/http-response';
import { PersonModel } from '@models/rrhh/person.model';
import { CoreService, MessageService } from '@services/resources';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonalInformationService {
  API_URL = `${environment.API_URL}/person`;


constructor(
  private coreService: CoreService,
  private httpClient: HttpClient,
  private messageService: MessageService,
) {

 }

 create(payload: PersonModel): Observable<PersonModel> {
  const url = `${this.API_URL}`;

  this.coreService.showLoad();
  return this.httpClient.post<ServerResponse>(url, payload).pipe(
    map((response) => {
      this.coreService.hideLoad();
      this.messageService.success(response).then();
      return response.data;
    })
  );
}

}
