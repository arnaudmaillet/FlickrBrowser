import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cards-images',
  templateUrl: './cards-images.component.html',
  styleUrls: ['./cards-images.component.css']
})
export class CardsImagesComponent implements OnInit {

  @Input() images_: any[] = [];

  constructor() {}

  ngOnInit(): void {
  }

  onClick() {
    // change open to true

  }


}
