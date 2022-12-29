import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CardModalComponent } from '../card-modal/card-modal.component';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {

  constructor(private matDialog: MatDialog) { }

  @Input() images: any[] | undefined = undefined;

  ngOnInit(): void {

  }

  openDialog(image: any){
    this.matDialog.open(CardModalComponent, {
      data: image,
      autoFocus: false,
      maxHeight: '95vh'
    });
  }
}
