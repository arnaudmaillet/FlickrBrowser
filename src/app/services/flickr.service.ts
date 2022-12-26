import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Owner {
  nsid: string;
  username: string;
  name: string;
  avatar: string;
  photos: FlickrPhoto[];
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
  owner: string;
  ownerInfos: Owner;
  dates: Dates;
  dateFormatted: DatesFormatted;
  comments: Comment[];
}

export interface Comment {
  pseudo: string;
  date: string;
  content: string;
}

export interface Dates {
  taken: Date;
  posted: Date;
  updated: Date;
}

export interface DatesFormatted {
  taken: string;
  posted: string;
  updated: string;
}

export interface FlickrResponse {
  photos: {
    photo: FlickrPhoto[];
  };
}

export interface Tags {
  hottags: any;
}

enum FlickrMethod {
  SEARCH = 'flickr.photos.search',
  GET_INFO = 'flickr.photos.getInfo',
  GET_RECENT = 'flickr.photos.getRecent',
  GET_SIZES = 'flickr.photos.getSizes',
  GET_COMMENTS = 'flickr.photos.comments.getList',
  GET_USER_PHOTOS = 'flickr.people.getPublicPhotos',
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
    maxDate: Date,
    minDate: Date,
    safeMode: string,
    tags: string[],
    sort: string,
  ): Observable<Object> {
    let stringTags = this.parseTags(tags);
    let tagsParams = stringTags.length > 0 ? `&tags=${stringTags}` : '';
    const args = `&${this._apiKey}&text=${searchText}&color_codes=e&sort=${sort}&min_taken_date=${minDate.toISOString().substring(0, 10)}&max_taken_date=${maxDate.toISOString().substring(0, 10)}${tagsParams}&safe_search=${safeMode}&per_page=${perPage}&${this._format}`;
    //console.log(args);
    return this.http
      .get<FlickrResponse>(`${this._apiUrl}${FlickrMethod.SEARCH}${args}`)
      .pipe(
        map(async (res: FlickrResponse) => {
          const photos: any[] = [];
          //console.log(res);
          res.photos?.photo?.forEach(async (photo: any) => {
            await lastValueFrom(this.getPhotoInfo(photo.id, perPage)).then(
              async (resInfo: any) => {
                await lastValueFrom(this.getComments(photo.id)).then(
                  async (resComments: any) => {
                    await lastValueFrom(this.getUserPhotos(photo.owner, perPage, safeMode)).then(
                      async (resUserPhotos: any) => {
                        photos.push(this.instanciatePhoto(photo, resInfo, resComments, resUserPhotos));
                      }
                    ); 
                  }
                );
              }
            );
          });

          //console.log(photos);
          return photos;
        })
      );
  }

  getRecentPhotos(perPage: number): Observable<Object> {
    const args = `&${this._apiKey}&${this._format}&per_page=${perPage}`;

    return this.http
      .get<FlickrResponse>(`${this._apiUrl}${FlickrMethod.GET_RECENT}${args}`)
      .pipe(
        map(async (res: FlickrResponse) => {
          const photos: any[] = [];
          //console.log(res);
          res.photos.photo.forEach(async (photo) => {
            await lastValueFrom(this.getPhotoInfo(photo.id, perPage)).then(
              async (resInfo: any) => {
                await lastValueFrom(this.getComments(photo.id)).then(
                  async (resComments: any) => {
                    await lastValueFrom(this.getUserPhotos(photo.owner, 50, "Restricted")).then(
                      async (resUserPhotos: any) => {
                        console.log(photo.owner);
                        photos.push(this.instanciatePhoto(photo, resInfo, resComments, resUserPhotos));
                      }
                    );
                  }
                );
              });
          });
          //console.log(photos);
          return photos;
        })
      );
  }

  private getUserPhotos(userId: string, perPage: number, safeMode: string): Observable<Object> {
    const args = `&${this._apiKey}&user_id=${userId}&safe_search=${safeMode}&per_page=${perPage}&${this._format}`;
    return this.http.get(`${this._apiUrl}${FlickrMethod.GET_USER_PHOTOS}${args}`);
  }

  private getPhotoSizes(photoId: string): Observable<Object> {
    const args: string = `&${this._apiKey}&photo_id=${photoId}&format=json&nojsoncallback=1`;
    return this.http.get(`${this._apiUrl}${FlickrMethod.GET_SIZES}${args}`);
  }

  private getPhotoInfo(photoId: string, perPage: number): Observable<Object> {
    const args: string = `&${this._apiKey}&photo_id=${photoId}&per_page=${perPage}&format=json&nojsoncallback=1`;
    return this.http.get(`${this._apiUrl}${FlickrMethod.GET_INFO}${args}`);
  }

  private getComments(photoId: string): any {
    const args: string = `&${this._apiKey}&photo_id=${photoId}&format=json&nojsoncallback=1`;
    return this.http.get(`${this._apiUrl}${FlickrMethod.GET_COMMENTS}${args}`);
  }

  private parseTags(tags: string[]): string {
    let tagsParsed: string = '';
    tags.forEach((tag) => {
      tagsParsed += tag + '-';
    });
    return tagsParsed.slice(0, -1);
  }

  private getUrls(photos: any[]): any {  
    photos.forEach((photo) => {
      photo.url = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;
    });
    return photos;
  }

  private instanciatePhoto(photo: any, resInfo: any, resComment: any, resUserPhotos): any {
    if (resInfo.photo.owner) {
      let avatarUrl: string = `http://farm${photo.farm}.staticflickr.com/${photo.server}/buddyicons/${resInfo.photo.owner?.nsid}.jpg`;
      return {
        url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`,
        title: photo.title.length === 0 ? 'No title' : photo.title,
        description: resInfo.photo.description._content,
        info: resInfo,
        id: photo.id,
        server: photo.server,
        secret: photo.secret,
        farm: photo.farm,
        comments: resComment?.comments?.comment,
        dates: {
          taken: new Date(resInfo.photo.dates.taken),
          posted: new Date(resInfo.photo.dates.posted * 1000),
          updated: new Date(resInfo.photo.dates.lastupdate * 1000),
        },
        datesFormatted: {
          taken: resInfo.photo.dates.taken.substring(0, 10),
          posted: new Date(resInfo.photo.dates.posted * 1000).toLocaleString().substring(0, 10),
          updated: new Date(resInfo.photo.dates.lastupdate * 1000).toLocaleString().substring(0, 10)
        },
        owner: photo.owner,
        ownerInfos: {
          nsid: resInfo.photo.owner.nsid,
          username: resInfo.photo.owner.username,
          name: resInfo.photo.owner.realname,
          avatar: avatarUrl,
          photos: this.getUrls(resUserPhotos.photos.photo),
        },
      };
    }
  }
}
