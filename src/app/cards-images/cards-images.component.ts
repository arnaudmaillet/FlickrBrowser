import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CardModalComponent } from '../card-modal/card-modal.component';

@Component({
  selector: 'app-cards-images',
  templateUrl: './cards-images.component.html',
  styleUrls: ['./cards-images.component.css']
})
export class CardsImagesComponent implements OnInit {

  @Input() images: any[] = [];
  constructor(private matDialog: MatDialog) {}

  ngOnInit(): void {
    
  }

  openDialog(image: any){
    this.matDialog.open(CardModalComponent, {
      data: image
    });
  }
}
