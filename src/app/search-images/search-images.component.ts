import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { FlickrService } from '../services/flickr.service';
import { FormControl, FormGroup } from '@angular/forms';

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
  private _keyword: string;
  private _numberOfImages: number;
  private _images: any[];
  private _startDate: Date;
  private _endDate: Date;
  private _sort: Sort;
  public form: FormGroup;

  constructor(private flickrService: FlickrService) {}

  ngOnInit(): void {
    this._keyword = '';
    this._numberOfImages = 100;
    this._sort = Sort.DATE_POSTED_DESC;
    this._images = [];
    this._startDate = new Date(1990, 1, 1);
    this._endDate = new Date();
    this.form = new FormGroup({
      keyword: new FormControl(this._keyword),
      numberOfImages: new FormControl(this._numberOfImages),
      startDate: new FormControl(this._startDate),
      endDate: new FormControl(this._endDate),
    });

    this.getRecentPhotos();
  }

  get images() {
    return this._images;
  }

  get numberOfImages() {
    return this._numberOfImages;
  }

  get startDate() {
    return this._startDate;
  }

  get endDate() {
    return this._endDate;
  }

  set keyword(keyword: string) {
    this._keyword = keyword;
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
        `${this._sort}`
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

  onSubmit() {
    this._keyword = this.form.value.keyword;
    this._numberOfImages = this.form.value.numberOfImages;
    this._startDate = this.form.value.startDate;
    this._endDate = this.form.value.endDate;

    if (this._keyword.toLowerCase().includes('f40')) {
      this._keyword = 'twingo';
    }
    this._keyword.length > 0 ? this.searchPhotos() : this.getRecentPhotos();
  }
}
