import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ServerResponse } from '@models/http-response';
import { PaginatorModel } from '@models/resources';
import { CreateHolidayDto, HolidayModel, ReadHolidayDto, UpdateHolidayDto } from '@models/rrhh/holiday.model';
import { CoreService, MessageService } from '@services/resources';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HolidayHttpService {

  API_URL = `${environment.API_URL}/holiday`;
  private pagination = new BehaviorSubject<PaginatorModel>(this.coreService.paginator);
  public pagination$ = this.pagination.asObservable();
  selectedholiday:ReadHolidayDto = {};
  constructor(
    private coreService: CoreService,
    private httpClient: HttpClient,
    private messageService: MessageService,
  ) {
  }

  create(payload: CreateHolidayDto): Observable<HolidayModel> {
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

  findAll(page: number = 0, search: string = ''): Observable<HolidayModel[]> {
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

  findByPlanning( page: number = 0, search: string = '',planningId: string): Observable<HolidayModel[]> {
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
  get holiday  (): ReadHolidayDto{
    return this.selectedholiday;
  }

  set holiday (value: ReadHolidayDto) {
     this.selectedholiday = value ;
  }
  findByPlanningTimeline( page: number = 0, search: string = '',planningId: string): Observable<HolidayModel[]> {
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

  findOne(id: string): Observable<HolidayModel> {
    const url = `${this.API_URL}/${id}`;

    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data;
      })
    );
  }

  update(id: string, payload: UpdateHolidayDto): Observable<HolidayModel> {
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


  remove(id: string): Observable<HolidayModel> {
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

  removeAll(holiday: HolidayModel[]): Observable<HolidayModel[]> {
    const url = `${this.API_URL}/remove-all`;

    this.coreService.showLoad();
    return this.httpClient.patch<ServerResponse>(url, holiday).pipe(
      map((response) => {
        this.coreService.hideLoad();
        this.messageService.success(response).then();
        return response.data;
      })
    );
  }

}
