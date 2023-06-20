import { Component, NgZone, OnInit, Inject} from '@angular/core';
import { AssignmentsService } from '../shared/assignments.service';
import { Assignment } from './assignment.model';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {MatDialog,MatDialogRef} from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';
import { AddNoteDialogComponent } from '../add-note-dialog/add-note-dialog.component';
import { AddAssignmentComponent } from './add-assignment/add-assignment.component';


export interface DialogData {
  assignment: Assignment;
}

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css'],
})
export class AssignmentsComponent implements OnInit {
  assignments:Assignment[] = [];
  displayedColumns: string[] = ['id', 'nom', 'dateDeRendu', 'rendu'];


  // pagination assignment non rendus
  page=1;
  limit=10;
  totalPages=0;
  prevPage= 1;
  nextPage= 2;

  // pagination assignment rendus
  pageRendus=1;
  totalPagesRendus=0;
  prevPageRendus= 1;
  nextPageRendus= 2;

  assignmentsRendus:Assignment[] = [];
  assignmentsNonRendus:Assignment[] = [];
  utilisateur: any;

  constructor(private assignmentsService:AssignmentsService, private ngZone: NgZone, public dialog: MatDialog, private authService: AuthService, private router: Router) {}

  // appelé après le constructeur et AVANT l'affichage du composant
  ngOnInit(): void {
    // console.log("Dans ngOnInit, appelé avant l'affichage");
    this.getAssignments();
    this.utilisateur = JSON.parse(localStorage.getItem('user') || '{}');
    // console.log(this.utilisateur)
  }


  // Récupérer les assignments
  getAssignments() {
      // demander les données au service de gestion des assignments...
      this.getAssignmentsRendus(); 
      this.getAssignmentsNonRendus()

      // console.log("Assignment Rendus et non rendus reçus ... ");
  }

  getAssignmentsRendus(){
    
    this.assignmentsService.getAssignments(this.pageRendus, this.limit, true)
    .subscribe(response => {
      this.assignmentsRendus = response.assignments.docs;
      this.totalPagesRendus = response.assignments.totalPages;
      this.prevPageRendus = response.assignments.prevPage;
      this.nextPageRendus = response.assignments.nextPage;
    });
  }

  getAssignmentsNonRendus(){
      
    this.assignmentsService.getAssignments(this.page, this.limit, false)
    .subscribe(response => {
      this.assignmentsNonRendus = response.assignments.docs;
      this.totalPages = response.assignments.totalPages;
      this.prevPage = response.assignments.prevPage;
      this.nextPage = response.assignments.nextPage;
    });
  }


  // Pagination fonctions
  pagePrecedente() {
    this.page--;
    this.getAssignmentsNonRendus();
  }

  pageSuivante() {
    this.page++;
    this.getAssignmentsNonRendus();
  }

  premierePage() {
    this.page = 1;
    this.getAssignmentsNonRendus();
  }

  dernierePage() {
    this.page = this.totalPages;
    this.getAssignmentsNonRendus();
  }

  pagePrecedenteRendus() {
    this.pageRendus--;
    this.getAssignmentsRendus();
  }

  pageSuivanteRendus() {
    this.pageRendus++;
    this.getAssignmentsRendus();
  }

  premierePageRendus() {
    this.pageRendus = 1;
    this.getAssignmentsRendus();
  }

  dernierePageRendus() {
    this.pageRendus = this.totalPagesRendus;
    this.getAssignmentsRendus();
  }

  // Noter ( drag and drop )
  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {

    const dialogRef = this.dialog.open(AddNoteDialogComponent, {
      width: "50%",
      data: {
        assignment : event.previousContainer.data[event.previousIndex]
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      const addNoteForm = {
        _id : event.previousContainer.data[event.previousIndex]._id,
        note : result.note,
        remarque : result.remarque
      }

      this.assignmentsService.updateAssignment(addNoteForm).subscribe(response => {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
          );
      });
      
    })
  }

  }

  // Ajouter Assignment ( appel dialog )
  ajouterAssignment(){
    const dialogRef = this.dialog.open(AddAssignmentComponent, {
      width: "100%"
    });
  }

  public disconnect = () => {
    this.authService.destroyToken();
    this.router.navigate(['/']);
  }

  canDrag(){
    if(this.utilisateur.isAdmin) return true;
    else return false;
  }
}
