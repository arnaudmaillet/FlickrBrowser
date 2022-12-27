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

  getDescription(description: string): string {
    if (description.length === 0 || description === undefined) {
      return 'No description';
    } else {
      return description;
    }
  }

  isAuthorsPhotosDisabled(photos: any | undefined): boolean {
    if (photos === undefined || photos.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  isDescriptionDisabled(description: string): boolean {
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

  isTagsEmpty(tags: string | undefined): string {
    if (tags === undefined || tags.length === 0) {
      return '';
    } else {
      return `Tags :`;
    }
  }
}

