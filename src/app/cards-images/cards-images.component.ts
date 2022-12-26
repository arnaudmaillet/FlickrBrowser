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

  displayTitle(title: string){
    return title.length > 20 ? title.substring(0, 20) + '...' : title;
  }

  displayDescription(description: string){
    if (description.length === 0) {
      return 'No description';
    } else if (description.length > 100) {
      return description.substring(0, 100) + '...';
    } else {
      return description;
    }
  }

  openDialog(image: any){
    this.matDialog.open(CardModalComponent, {
      data: image,
      disableClose: true,
      maxHeight: '95vh',
    });
  }
}
