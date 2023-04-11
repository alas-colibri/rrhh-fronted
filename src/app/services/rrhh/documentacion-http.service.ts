import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '@env/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ServerResponse} from '@models/http-response';
import { CoreService, MessageService } from '@services/resources';
import { PaginatorModel } from '@models/resources';
import { CreateEvaluationDto, EvaluationModel, ReadEvaluationDto, UpdateEvaluationDto } from '@models/rrhh/evaluation.model';
import { CreateDocumentacionDto, DocumentacionModel, ReadDocumentacionDto, UpdateDocumentacionDto } from '@models/rrhh/documentacion.models';

@Injectable({
  providedIn: 'root'
})
export class DocumentacionHttpService {
  API_URL = `${environment.API_URL}/documentacion`;
  private pagination = new BehaviorSubject<PaginatorModel>(this.coreService.paginator);
  public pagination$ = this.pagination.asObservable();
  selectedDocumentacion:ReadDocumentacionDto = {};
  constructor(
    private coreService: CoreService,
    private httpClient: HttpClient,
    private messageService: MessageService,
  ) {
  }

  create(payload: CreateDocumentacionDto): Observable<DocumentacionModel> {
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

  findAll(page: number = 0, search: string = ''): Observable<DocumentacionModel[]> {
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

  findByPlanning( page: number = 0, search: string = '',planningId: string): Observable<DocumentacionModel[]> {
    const url = `${this.API_URL}/plannings/${planningId}`;

    const headers = new HttpHeaders().append('pagination', 'true');
    const params = new HttpParams()
      .append('page', page)
      .append('search', search)
      .append('planningId', planningId);

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
  get documentacion  (): ReadDocumentacionDto{
    return this.selectedDocumentacion;
  }

  set documentacion  (value: ReadDocumentacionDto) {
     this.selectedDocumentacion = value ;
  }
  findByPlanningTimeline( page: number = 0, search: string = '',planningId: string): Observable<DocumentacionModel[]> {
    const url = `${this.API_URL}/timeline/${planningId}`;

    const headers = new HttpHeaders().append('pagination', 'true');
    const params = new HttpParams()
      .append('page', page)
      .append('search', search)
      .append('planningId', planningId);

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

  findOne(id: string): Observable<DocumentacionModel> {
    const url = `${this.API_URL}/${id}`;

    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data;
      })
    );
  }

  update(id: string, payload: UpdateDocumentacionDto): Observable<DocumentacionModel> {
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


  remove(id: string): Observable<DocumentacionModel> {
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

  removeAll(evaluations: DocumentacionModel[]): Observable<DocumentacionModel[]> {
    const url = `${this.API_URL}/remove-all`;

    this.coreService.showLoad();
    return this.httpClient.patch<ServerResponse>(url, evaluations).pipe(
      map((response) => {
        this.coreService.hideLoad();
        this.messageService.success(response).then();
        return response.data;
      })
    );
  }

}
