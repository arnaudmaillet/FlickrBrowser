import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CardModalComponent } from '../card-modal/card-modal.component';

@Component({
  selector: 'app-cards-images',
  templateUrl: './cards-images.component.html',
  styleUrls: ['./cards-images.component.css']
})
export class CardsImagesComponent implements OnInit {

  @Output() newItemEvent = new EventEmitter<number>();
  @Input() images: any[] = [];
  @Input() numberOfRows: number = 5;
  constructor(private matDialog: MatDialog) {}

  ngOnInit(): void {
    
  }

  getNumberOfRows(value: number) {
    this.newItemEvent.emit(value);
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

  updateRowsDisplay(event: any){
    this.numberOfRows = event.value;
    this.getNumberOfRows(event.value);
  }

  openDialog(image: any){
    this.matDialog.open(CardModalComponent, {
      data: image,
      autoFocus: false,
      maxHeight: '95vh'
    });
  }
}
