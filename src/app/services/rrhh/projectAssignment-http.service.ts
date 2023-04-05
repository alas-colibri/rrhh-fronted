import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { ServerResponse } from "@models/http-response";
import { PaginatorModel } from "@models/resources";
import { CreateProjectAssignmentDto, ProjectAssignmentModel, ReadProjectAssignmentDto, UpdateProjectAssignmentDto } from "@models/rrhh/projectAssignment";
import { CoreService, MessageService } from "@services/resources";
import { CatalogueTypeEnum } from "@shared/enums";
import { BehaviorSubject, Observable, map } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProjectAssignmentHttpService {
  API_URL = `${environment.API_URL}/projectAssignment`;
  private pagination = new BehaviorSubject<PaginatorModel>(this.coreService.paginator);
  public pagination$ = this.pagination.asObservable();
  selectedprojectAssignment:ReadProjectAssignmentDto = {};
  constructor(
    private coreService: CoreService,
    private httpClient: HttpClient,
    private messageService: MessageService,
  ) {
  }

  create(payload: CreateProjectAssignmentDto): Observable<ProjectAssignmentModel> {
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

  findAll(page: number = 0, search: string = ''): Observable<ProjectAssignmentModel[]> {
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

  projectAssignment(type: CatalogueTypeEnum): Observable<ProjectAssignmentModel[]> {
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

  /*
  get projectAssignment (): ReadProjectAssignmentDto{
    return this.selectedprojectAssignment;
  }

  set projectAssignment (value: ReadProjectAssignmentDto) {
     this.selectedprojectAssignment = value ;
  }*/
  /*findByPlanningTimeline( page: number = 0, search: string = '',planningId: string
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
*/
  findOne(id: string): Observable<ProjectAssignmentModel> {
    const url = `${this.API_URL}/${id}`;

    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data;
      })
    );
  }

  update(id: string, payload: UpdateProjectAssignmentDto): Observable<ProjectAssignmentModel> {
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


  remove(id: string): Observable<ProjectAssignmentModel> {
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

  removeAll(projectAssignment: ProjectAssignmentModel[]): Observable<ProjectAssignmentModel[]> {
    const url = `${this.API_URL}/remove-all`;

    this.coreService.showLoad();
    return this.httpClient.patch<ServerResponse>(url, projectAssignment).pipe(
      map((response) => {
        this.coreService.hideLoad();
        this.messageService.success(response).then();
        return response.data;
      })
    );
  }

}
