import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Assignment } from '../assignment.model';
import { Matiere } from '../matiere.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogData } from '../assignments.component';

@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css'],
})
export class AddAssignmentComponent implements OnInit {
  // Champ de formulaire
  nomAssignment!: string;
  matiere: Matiere = new Matiere();
  auteur!: string;
  dateDeRendu!: Date;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  thirdFormGroup!: FormGroup;
  fourthFormGroup!: FormGroup;
  isEditable = false;
  matieres: Matiere[] = [];


  constructor(private assignmentsService:AssignmentsService, private router:Router,private _formBuilder: FormBuilder,public dialogRef: MatDialogRef<AddAssignmentComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit(): void {
    this.getMatieres();

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required],
    });
    this.fourthFormGroup = this._formBuilder.group({
      fourthCtrl: ['', Validators.required],
    });

  }

  onSubmit() {
    if((!this.nomAssignment) || (!this.auteur) || (!this.matiere.nom) || (!this.dateDeRendu)) return;
    let newAssignment = new Assignment();
    newAssignment.nom = this.nomAssignment;
    newAssignment.auteur = this.auteur;
    newAssignment.matiere = this.matiere.nom;
    newAssignment.image = this.matiere.image;
    newAssignment.dateDeRendu = this.dateDeRendu;
    newAssignment.rendu = false;

    this.assignmentsService.addAssignment(newAssignment)
    .subscribe(reponse => {
      this.fermer();
    })
  }

  getMatieres(){
    const body =  {
      prof  : "admin111"
    }
    this.assignmentsService.getMatieres(body).subscribe(matieres => {
      this.matieres = matieres.matieres;
    })
  }

  fermer(): void {
    this.dialogRef.close();
  }

}
