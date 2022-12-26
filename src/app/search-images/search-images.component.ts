import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { FlickrService } from '../services/flickr.service';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import {COMMA, ENTER} from '@angular/cdk/keycodes';


enum Sort {
  DATE_POSTED_ASC = 'date-posted-asc',
  DATE_POSTED_DESC = 'date-posted-desc',
  INTERESTINGNESS_ASC = 'interestingness-asc',
  INTERESTINGNESS_DESC = 'interestingness-desc',
}

enum Code_color {
  RED = '0',
  BROWN = '1',
  ORANGE = '2',
  PINK = '3',
  YELLOW_GREEN = '4',
  YELLOW = '5',
  GREEN = '6',
  GREEN_BLUE = '7',
}

@Component({
  selector: 'app-search-images',
  templateUrl: './search-images.component.html',
  styleUrls: ['./search-images.component.css'],
})
export class SearchImagesComponent implements OnInit {
  private _keyword: string;
  private _numberOfImages: number;
  private _images: any[];
  private _minDate: Date;
  private _maxDate: Date;
  private _sort: Sort;
  private _safeMode: string;
  private _tags: string[] = [];
  private color: Code_color;
  private isColorEnabled: boolean;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl('');
  

  maxDatePicker: NgbDateStruct;
  minDatePicker: NgbDateStruct;
  form: FormGroup;

  constructor(private flickrService: FlickrService) {
  }

  ngOnInit(): void {
    this._keyword = '';
    this._numberOfImages = 100;
    this._sort = Sort.DATE_POSTED_DESC;
    this._images = [];
    this._minDate = new Date('2000-01-01');
    this._maxDate = new Date();
    this.color = Code_color.RED;
    this.isColorEnabled = false;
    this._safeMode = 'Restricted';
    this._tags = [];
    this.form = new FormGroup({
      keyword: new FormControl(this._keyword),
      numberOfImages: new FormControl(this._numberOfImages),
    });

    this.getRecentPhotos();
  }

  get images() {
    return this._images;
  }

  get numberOfImages() {
    return this._numberOfImages;
  }

  get maxDate() {
    return this._maxDate;
  }

  get minDate() {
    return this._minDate;
  }

  get tags() {
    return this._tags;
  }

  get safeMode() {
    return this._safeMode;
  }

  set keyword(keyword: string) {
    this._keyword = keyword;
  }

  setTags(tags: string[]) {
    if (tags === undefined) {
      this._tags = [];
    } else {
      this._tags = tags;
    }
  }

  private setMaxDate(maxDate: NgbDateStruct) {
    if (maxDate === undefined) {
      this._maxDate = new Date();
    }
    else {
      this._maxDate = new Date(
        `${maxDate.year}-${maxDate.month}-${maxDate.day}`
      );
    }
  }

  private setMinDate(minDate: NgbDateStruct) {
    if (minDate === undefined) {
      this._minDate = new Date('2000-01-01');
    }
    else {
      this._minDate = new Date(
        `${minDate.year}-${minDate.month}-${minDate.day}`
      );
    }
  }

  setNumberOfImages(event: any) {
    this._numberOfImages = event.target.value;
    this.searchPhotos();
  }

  sortPhotos(event: any) {
    this.updateSort(event.target.value);
    if (this._keyword.length > 0) {
      this.searchPhotos();
    } else {
      this.getRecentPhotos();
    }
  }

  private async searchPhotos() {
    await lastValueFrom(
      this.flickrService.searchPhotos(
        this._keyword,
        this._numberOfImages,
        this._maxDate,
        this._minDate,
        this._safeMode,
        this._tags,
        this._sort,
      )
    ).then((res: any) => {
      this._images = res;
    });
  }

  private async getRecentPhotos() {
    await lastValueFrom(
      this.flickrService.getRecentPhotos(this._numberOfImages)
    ).then((res: any) => {
      this._images = res;
    });
  }

  private updateSort(sort: string) {
    switch (sort) {
      case 'date-posted-asc':
        this._sort = Sort.DATE_POSTED_ASC;
        break;
      case 'date-posted-desc':
        this._sort = Sort.DATE_POSTED_DESC;
        break;
      case 'interestingness-asc':
        this._sort = Sort.INTERESTINGNESS_ASC;
        break;
      case 'interestingness-desc':
        this._sort = Sort.INTERESTINGNESS_DESC;
        break;
      default:
        this._sort = Sort.DATE_POSTED_DESC;
        break;
    }
  }

  setSafeMode(event: any) {
    this._safeMode = event.target.value;
    this.searchPhotos();
  }

  onSubmit(): void {
    this._keyword = this.form.value.keyword;
    this._numberOfImages = this.form.value.numberOfImages;
    this.setMinDate(this.minDatePicker);
    this.setMaxDate(this.maxDatePicker);

    if (this._keyword === undefined || this._keyword.length === 0) {
      alert('Veuillez saisir un mot clé');
    } else
    {
      if (this._minDate < this._maxDate) {
        if (this._keyword.toLowerCase().includes('f50')) {
          this._keyword = 'twingo';
        }
        this.searchPhotos();
      } else {
        alert('La date de début doit être inférieure à la date de fin');
      }
    }
  }

  private findColor(color: string) {
    switch (color) {
      case 'Red':
        return Code_color.RED;
      case 'Brown':
        return Code_color.BROWN;
      case 'Orange':
        return Code_color.ORANGE;
      case 'Pink':
        return Code_color.PINK;
      case 'Yellow Green':
        return Code_color.YELLOW_GREEN;
      case 'Yellow':
        return Code_color.YELLOW;
      case 'Green':
        return Code_color.GREEN;
      case 'Green Blue':
        return Code_color.GREEN_BLUE;
      default:
        return Code_color.RED;
    }
  }
}
