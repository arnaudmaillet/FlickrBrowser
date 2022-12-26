import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-card-modal',
  templateUrl: './card-modal.component.html',
  styleUrls: ['./card-modal.component.css']
})

export class CardModalComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public image: any, private matDialog: MatDialog) { }


  ngOnInit(): void {
    console.log(this.image);
  }

  getDateToString(date: string){
    let yourDate = new Date(parseInt(date) * 1000)
    return yourDate.toISOString().split('T')[0]
  }

  isDescriptionDisabled(description: string){
    if (description.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  isCommentDisabled(comments: any | undefined){
    if (comments === undefined) {
      return true;
    } else {
      return false;
    }
  }

  closeDialog(){
    this.matDialog.closeAll();
  }
}

