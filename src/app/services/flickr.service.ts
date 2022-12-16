import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Owner {
  nsid: string;
  username: string;
  name: string;
  avatar: string;
}

export interface FlickrPhoto {
  url: string;
  farm: string;
  id: string;
  title: string;
  secret: string;
  server: string;
  info: any;
  description: string;
  owner: Owner;
}

export interface FlickrResponse {
  photos: {
    photo: FlickrPhoto[];
  };
}

enum FlickrMethod {
  SEARCH = 'flickr.photos.search',
  GET_INFO = 'flickr.photos.getInfo',
  GET_RECENT = 'flickr.photos.getRecent',
}

@Injectable({
  providedIn: 'root',
})
export class FlickrService {
  private _apiUrl: string = 'https://www.flickr.com/services/rest/?method=';
  private _apiKey: string = `api_key=${environment.flickr.api_key}`;
  private _format: string = 'format=json&nojsoncallback=1';

  constructor(private http: HttpClient) {}

  searchPhotos(
    searchText: string,
    perPage: number,
    sort: string
  ): Observable<Object> {
    const args = `${this._apiKey}&text=${searchText}&sort=${sort}&per_page=${perPage}&${this._format}`;
    console.log(args);
    return this.http
      .get<FlickrResponse>(`${this._apiUrl}${FlickrMethod.SEARCH}&${args}`)
      .pipe(
        map(async (res: FlickrResponse) => {
          const photos: any[] = [];
          console.log(res);
          res.photos.photo.forEach(async (photo) => {
            await lastValueFrom(this.getPhotoInfo(photo.id, perPage)).then(
              async (res: any) => {
                photos.push(this.instanciatePhoto(photo, res));
              }
            );
          });

          //console.log(photos);
          return photos;
        })
      );
  }

  getRecentPhotos(perPage: number): Observable<Object> {
    const args = `${this._apiKey}&${this._format}&per_page=${perPage}`;

    return this.http
      .get<FlickrResponse>(`${this._apiUrl}${FlickrMethod.GET_RECENT}&${args}`)
      .pipe(
        map(async (res: FlickrResponse) => {
          const photos: any[] = [];
          //console.log(res);
          res.photos.photo.forEach(async (photo) => {
            await lastValueFrom(this.getPhotoInfo(photo.id, perPage)).then(
              async (res: any) => {
                photos.push(this.instanciatePhoto(photo, res));
              }
            );
          });

          //console.log(photos);
          return photos;
        })
      );
  }

  private getPhotoInfo(photoId: string, perPage: number): Observable<Object> {
    const args: string = `${this._apiKey}&photo_id=${photoId}&per_page=${perPage}&format=json&nojsoncallback=1`;
    return this.http.get(`${this._apiUrl}${FlickrMethod.GET_INFO}&${args}`);
  }

  private getDescription(photo: any): string {
    let description = 'No description';
    if (photo.description._content) {
      if (photo.description._content.length > 100) {
        description = photo.description._content.substring(0, 100) + ' ...';
      } else {
        description = photo.description._content;
      }
    }
    return description;
  }

  private instanciatePhoto(photo: any, res: any): FlickrPhoto {
    let avatarUrl: string = `http://farm${photo.farm}.staticflickr.com/${photo.server}/buddyicons/${res.photo.owner.nsid}.jpg`;
    return {
      url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`,
      title:
        photo.title.length > 20
          ? photo.title.substring(0, 20) + ' ...'
          : photo.title,
      description: this.getDescription(res.photo),
      info: res,
      id: photo.id,
      server: photo.server,
      secret: photo.secret,
      farm: photo.farm,
      owner: {
        nsid: res.photo.owner.nsid,
        username: res.photo.owner.username,
        name: res.photo.owner.realname,
        avatar: avatarUrl,
      },
    };
  }
}
