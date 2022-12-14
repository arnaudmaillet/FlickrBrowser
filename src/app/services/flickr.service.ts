import { Injectable } from '@angular/core';
import { HttpClient, HttpStatusCode } from '@angular/common/http';
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
  GET_POPULAR = 'flickr.photos.getPopular'
}

@Injectable({
  providedIn: 'root'
})

export class FlickrService {

  private apiKey: string = `api_key=${environment.flickr.api_key}`;
  private format: string = 'format=json&nojsoncallback=1';

  constructor(private http: HttpClient) { }

  getPopularPhotos(perPage: number): Observable<Object> {
    const url: string = 'https://www.flickr.com/services/rest/?method=';
    const args = `${this.apiKey}&${this.format}&per_page=${perPage}`;

    return this.http.get<FlickrResponse>(`${url}${FlickrMethod.GET_POPULAR}&${args}`)
                    .pipe(map(async(res: FlickrResponse) => {

      const photos: any[] = [];
      console.log(res);
      res.photos.photo.forEach(async photo => {
        await lastValueFrom(this.getPhotoInfo(photo.id, perPage)).then(async(res: any) => {
          photos.push(this.instanciatePhoto(photo, res));
        });
      });

      return photos;
    }));
  }

  searchPhotos(searchText: string, perPage: number): Observable<Object> {
    const url: string = 'https://www.flickr.com/services/rest/?method=';
    const args = `${this.apiKey}&text=${searchText}&${this.format}&per_page=${perPage}`;

    return this.http.get<FlickrResponse>(`${url}${FlickrMethod.SEARCH}&${args}`)
                    .pipe(map(async(res: FlickrResponse) => {

      const photos: any[] = [];

      res.photos.photo.forEach(async photo => {
        await lastValueFrom(this.getPhotoInfo(photo.id, perPage)).then(async(res: any) => {
          photos.push(this.instanciatePhoto(photo, res));
        });
      });

      console.log(photos);
      return photos;

    }));
  }

  private getPhotoInfo(photoId: string, perPage: number): Observable<Object> {
    const url: string = `https://www.flickr.com/services/rest/?method=flickr.photos.getInfo&per_page=${perPage}`;
    const args: string = `api_key=${environment.flickr.api_key}&photo_id=${photoId}&format=json&nojsoncallback=1`;
    return this.http.get(`${url}&${args}`);
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
      title: photo.title.length > 20 ? photo.title.substring(0, 20) + ' ...' : photo.title,
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
        avatar: avatarUrl
      }
    };
  }

  // private urlExists(url: string): boolean {
  //   this.http.get(url, { observe: 'response', responseType: 'text' }).pipe(map(res => {
  //     return res.status === HttpStatusCode.Ok;
  //   }));
  //}
}
