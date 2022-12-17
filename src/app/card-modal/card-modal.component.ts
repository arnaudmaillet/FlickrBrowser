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

  closeDialog(){
    this.matDialog.closeAll();
  }
}

