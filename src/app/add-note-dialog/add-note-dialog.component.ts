import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogData } from '../assignments/assignments.component';

@Component({
  selector: 'app-add-note-dialog',
  templateUrl: './add-note-dialog.component.html',
  styleUrls: ['./add-note-dialog.component.css']
})
export class AddNoteDialogComponent implements OnInit {

  thereIsError = false;
  error = "";
  note !: number;
  remarque !: string;
  isDisabled = true;

  constructor(public dialogRef: MatDialogRef<AddNoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  rendre(){
    // console.log(this.note)
    this.verifierNote();
    if(!this.thereIsError){
      this.dialogRef.close({ note: this.note, remarque : this.remarque })
    }
  }

  verifierNote(){
    if(this.note < 0 || this.note > 20){
      this.thereIsError = true;
      this.error = "Note saisie invalide";
    }
  }

}
