import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { FlickrService } from '../services/flickr.service';

@Component({
  selector: 'app-search-images',
  templateUrl: './search-images.component.html',
  styleUrls: ['./search-images.component.css']
})
export class SearchImagesComponent implements OnInit {
  private _images: any[] = [];
  private _keyword: string = '';
  private _numberOfImages: number = 100;

  constructor(private flickrService: FlickrService) { }

  get images() {
    return this._images;
  }

  get numberOfImages() {
    return this._numberOfImages;
  }

  set keyword(keyword: string) {
    this._keyword = keyword;
  }

  ngOnInit(): void {
    //this.getPopularPhotos();
  }

  setNumberOfImages(event: any) {
    this._numberOfImages = event.target.value;
    this.searchPhotos();
  }

  search(event: any) {
    let exeption = false;
    this._keyword = event.target.value;
    exeption = this._keyword.toLowerCase().includes('f40');
    if (this._keyword === '') {
      this.getPopularPhotos();
    } else if (exeption) {
      this._keyword = 'twingo';
    } else if (this._keyword && this._keyword.length > 0) {
      this.searchPhotos()
    }
  }

  async searchPhotos() {
    await lastValueFrom(this.flickrService.searchPhotos(this._keyword, this._numberOfImages)).then((res: any) => {
      this._images = res;
    });
  }

  async getPopularPhotos() {
    await lastValueFrom(this.flickrService.getPopularPhotos(this._numberOfImages)).then((res: any) => {
      this._images = res;
    });
  }
}
