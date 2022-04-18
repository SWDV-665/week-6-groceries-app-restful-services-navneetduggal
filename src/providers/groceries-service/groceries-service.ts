import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {map, catchError} from 'rxjs/operators';
import { Subject } from 'rxjs';
//import {Subject} from 'rxjs';

/*
  Generated class for the GroceriesServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GroceriesServiceProvider {

  items: any = [];
  dataChanged$: Observable<boolean>;

  private dataChangeSubject: Subject<boolean>;

  baseURL = "http://localhost:8080";
  constructor(public http: HttpClient) {
    console.log('Hello GroceriesServiceProvider Provider');

    this.dataChangeSubject = new Subject<boolean>();
    this.dataChanged$ = this.dataChangeSubject.asObservable();
  }

  getItems():Observable<object[]> {
    return this.http.get(this.baseURL + '/api/groceries').pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  private extractData(res: Response){
    let body = res;
    return body || [];
  }

  private handleError(error: Response | any){
    let errorMsg: string;
    if (error instanceof Response) {
      const err = error || '';
      errorMsg = `${error.status} - ${error.statusText || ''} ${err}`;      
    } else {
      errorMsg = error.message ? error.message : error.toString();
    }
    console.error(errorMsg);
    return Observable.throw(errorMsg);
  }

  removeItem(id) {
    this.http.delete(this.baseURL + "/api/groceries/"+ id).subscribe(res => {
      this.items = res;
      this.dataChangeSubject.next(true);
    })
 
  }

  addItem(item) {
    this.http.post(this.baseURL + "/api/groceries", item).subscribe(res => {
      this.items = res;
      this.dataChangeSubject.next(true);
    })
  }

  editItem(item, id) {
   this.http.put(this.baseURL + "/api/groceries/"+ id, item).subscribe(res => {
     this.items = res;
     this.dataChangeSubject.next(true);
   })

  }

}
