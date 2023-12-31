import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, filter, forkJoin, map, Observable, of, pairwise, tap } from 'rxjs';
import { Assignment } from '../assignments/assignment.model';
import { LoggingService } from './logging.service';
import { bdInitialAssignments } from './data';
import { AuthService } from './auth.service';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class AssignmentsService {
  assignments:Assignment[] = [];

  constructor(private loggingService:LoggingService, private http:HttpClient, private auth:AuthService) {
    this.loggingService.setNiveauTrace(2);

  }


  url = environment.myurl + "/assignments";

  protected getOptions(options: any = {}) : any {
    let requestHeaders: HttpHeaders;
    requestHeaders = new HttpHeaders({
        'Access-Control-Allow-Headers': '*',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'token' : this.auth.getToken()
      });
    if(!options.observe) {
      options.observe = 'body'
    }
    options.headers = requestHeaders;
    return options;
  }

  getAssignments(page:number, limit:number, rendu: boolean):Observable<any> {
    // en réalité, bientôt au lieu de renvoyer un tableau codé en dur,
    // on va envoyer une requête à un Web Service sur le cloud, qui mettra un
    // certain temps à répondre. On va donc préparer le terrain en renvoyant
    // non pas directement les données, mais en renvoyant un objet "Observable"
    //return of(this.assignments);
    //return this.http.get<Assignment[]>(this.url + "?page=" + page + "&limit=" + limit);

    const url = environment.myurl+"/getAssignments";
    return this.http.post<Assignment[]>(url, { "page" : page, "limit" : limit, "rendu" : rendu}, this.getOptions({}))
  }


  getAssignment(id:string):Observable<any> {

    return this.http.get<Assignment>(`${this.url}/${id}` , this.getOptions({}));
  }

  getMatieres(body: any):Observable<any> {
    const url = environment.myurl+"/matieres";
    return this.http.post<Assignment>(url, body,this.getOptions({}));
  }


  private handleError<T>(operation: any, result?: T) {
    return (error: any): Observable<T> => {
      console.log(error); // pour afficher dans la console
      console.log(operation + ' a échoué ' + error.message);

      return of(result as T);
    }
  }

  addAssignment(assignment:Assignment):Observable<any> {
   // this.assignments.push(assignment);

    this.loggingService.log(assignment.nom, "ajouté");

    return this.http.post<Assignment>(this.url, assignment,this.getOptions({}));

  }

  updateAssignment(body: any):Observable<any> {
    return this.http.put<Assignment>(this.url, body,this.getOptions({}));
  }

  deleteAssignment(assignment:Assignment):Observable<any> {
    this.loggingService.log(assignment.nom, "supprimé");
    return this.http.delete(this.url + "/" + assignment._id,this.getOptions({}));
  }

  peuplerBD() {
    bdInitialAssignments.forEach(a => {
      let newAssignment = new Assignment();
      newAssignment.nom = a.nom;
      newAssignment.dateDeRendu = new Date(a.dateDeRendu);
      newAssignment.rendu = a.rendu;
      newAssignment.id = a.id;

      this.addAssignment(newAssignment)
      .subscribe(reponse => {
        console.log(reponse.message);
      })
    })
  }

  peuplerBDAvecForkJoin(): Observable<any> {
    const appelsVersAddAssignment:any = [];

    bdInitialAssignments.forEach((a) => {
      const nouvelAssignment:any = new Assignment();

      nouvelAssignment.id = a.id;
      nouvelAssignment.nom = a.nom;
      nouvelAssignment.dateDeRendu = new Date(a.dateDeRendu);
      nouvelAssignment.rendu = a.rendu;

      appelsVersAddAssignment.push(this.addAssignment(nouvelAssignment));
    });
    return forkJoin(appelsVersAddAssignment); // renvoie un seul Observable pour dire que c'est fini
  }

}
