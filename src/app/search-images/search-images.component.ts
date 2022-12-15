import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { FlickrService } from '../services/flickr.service';
import { FormControl, FormGroup } from '@angular/forms';

enum Sort {
  RELEVANCE = 'relevance',
  DATE_POSTED = 'date-posted-',
  DATE_TAKEN = 'date-taken-',
  INTERESTINGNESS = 'interestingness-'
}

enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
  NONE = ''
}
@Component({
  selector: 'app-search-images',
  templateUrl: './search-images.component.html',
  styleUrls: ['./search-images.component.css']
})

export class SearchImagesComponent implements OnInit {
  private _keyword: string;
  private _numberOfImages: number;
  private _images: any[];
  private _startDate: Date;
  private _endDate: Date;
  private _sort: Sort;
  private _sortOrder: SortOrder;
  public form: FormGroup;

  constructor(private flickrService: FlickrService) { }

  ngOnInit(): void {
    this._keyword = '';
    this._numberOfImages = 100;
    this._sort = Sort.RELEVANCE;
    this._sortOrder = SortOrder.DESC;
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

  async searchPhotos() {
    if (this._sort === Sort.RELEVANCE) {
      this._sortOrder = SortOrder.NONE;
    }
    await lastValueFrom(this.flickrService.searchPhotos(this._keyword, this._numberOfImages, `${this._sort}${this._sortOrder}`)).then((res: any) => {
      this._images = res;
    });
  }

  async getRecentPhotos() {
    await lastValueFrom(this.flickrService.getRecentPhotos(this._numberOfImages)).then((res: any) => {
      this._images = res;
    });
  }

  setSort(event: any) {
    this._sort = event.target.value;
    console.log(this._sort);
    this.searchPhotos();
  }

  onSubmit(){
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
