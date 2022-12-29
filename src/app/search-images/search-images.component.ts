import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { FlickrService } from '../services/flickr.service';
import { FormControl, FormGroup } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';


enum Sort {
  DATE_POSTED_ASC = 'date-posted-asc',
  DATE_POSTED_DESC = 'date-posted-desc',
  INTERESTINGNESS_ASC = 'interestingness-asc',
  INTERESTINGNESS_DESC = 'interestingness-desc',
}

@Component({
  selector: 'app-search-images',
  templateUrl: './search-images.component.html',
  styleUrls: ['./search-images.component.css'],
})

export class SearchImagesComponent implements OnInit {

  private _sort: Sort;
  private _tags: string[] = [];

  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl('');
  
  images: any[];
  keyword: string;
  displayMode: boolean;
  formMinDate: FormControl;
  formMaxDate: FormControl;
  maxDate: Date;
  minDate: Date;
  safeMode: string;
  form: FormGroup;
  numberOfCol: any[];
  numberOfCards: any[];
  colors: string[];
  colorDisabled: string;
  currentColor: string;

  constructor(private flickrService: FlickrService) {
    this.getRecentPhotos();
  }

  ngOnInit(): void {
    this.keyword = '';
    this._sort = Sort.DATE_POSTED_DESC;
    this.images = [];
    this.minDate = new Date('2000-01-01');
    this.maxDate = new Date();
    this.colors = ['red', 'brown', 'orange', 'pink', 'gold', 'yellowgreen', 'green', 'deepSkyBlue', 'blue', 'purple'];
    this.colorDisabled = 'grey';
    this.currentColor = null;
    this.safeMode = 'Restricted';
    this._tags = [];
    this.formMinDate = new FormControl(this.minDate);
    this.formMaxDate = new FormControl(this.maxDate);
    this.displayMode = false;
    this.numberOfCol = Array(5).fill(0).map((x,i)=>i);
    this.numberOfCards = Array(5).fill(0).map((x,i)=>i);
    this.form = new FormGroup({
      keyword: new FormControl(this.keyword)
    });
  }

  sortPhotos(sortValue: string) {
    if (this.keyword === '') {
      alert('Please enter a keyword');
    } else {
      this.updateSort(sortValue);
      this.updateNumberOfCards();
      this.onSubmit();
    }
  }

  setColor(color: any) {
    this.currentColor = color
    this.onSubmit();
  }


  updatenumberOfCol(number: number) {
    this.numberOfCol = Array(number).fill(0).map((x,i)=>i);
  }

  updateNumberOfCards() {
    let cards = this.images.length;
    this.numberOfCards = Array(cards).fill(0).map((x,i)=>i);
  }


  get tags() {
    return this._tags;
  }

  isDisabled(): boolean {
    return this.keyword === '';
  }

  isLoading(): boolean {
    return this.images.length === 0;
  }

  setTags(tags: string[]) {
    if (tags === undefined) {
      this._tags = [];
    } else {
      this._tags = tags;
    }
  }

  setMaxDate(date: any) {
    console.log(date);
    if (date === undefined) {
      this.maxDate = new Date();
    }
    else {
      this.maxDate = new Date(date);
    }
    console.log(this.maxDate);
  }

  setMinDate(date: any) {
    console.log(date);
    if (date === undefined) {
      this.minDate = new Date('2000-01-01');
    }
    else {
      this.minDate = new Date(date);
    }
    console.log(this.minDate);
  }


  getDisplayMode() {
    if (this.displayMode) {
      return 'Slider';
    } else {
      return 'Grid';
    }
  }

  private async searchPhotos() {
    await lastValueFrom(
      this.flickrService.searchPhotos(
        this.keyword,
        this.maxDate,
        this.minDate,
        this.safeMode,
        this._tags,
        this._sort,
        this.getCodeColor(this.currentColor)
      )
    ).then((res: any) => {
      this.images = res;
    });
  }

  private async getRecentPhotos() {
    await lastValueFrom(
      this.flickrService.getRecentPhotos()
    ).then((res: any) => {
      this.images = res;
    });
  }

  updateKeyword(event: any) {
    this.keyword = event.target.value;
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

  getCodeColor(color: any) {
    switch (color) {
      case 'red':
        return '0';
      case 'brown':
        return '1';
      case 'orange':
        return '2';
      case 'pink':
        return '3';
      case 'yellowgreen':
        return '4';
      case 'gold':
        return '5';
      case 'green':
        return '6';
      case 'deepSkyBlue':
        return '7';
      case 'blue':
        return '8';
      case 'purple':
        return '9';
      default:
        return null;
    }
  }

  setSafeMode(event: any) {
    this.safeMode = event.target.value;
    this.searchPhotos();
  }

  onSubmit(): void {
    this.updateNumberOfCards();
    if (this.keyword === undefined || this.keyword.length === 0) {
      alert('Veuillez saisir un mot clé');
    } else
    {
      if (this.minDate < this.maxDate) {
        if (this.keyword.toLowerCase().includes('f50')) {
          this.keyword = 'twingo';
        }
        this.searchPhotos();
        if (this.images.length === 0) {
          alert('Aucune photo trouvée');
        }
      } else {
        alert('La date de début doit être inférieure à la date de fin');
      }
    }
  }
}
