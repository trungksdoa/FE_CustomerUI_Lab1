import { Injectable } from '@angular/core';
import { Observable, distinctUntilChanged, Subject } from 'rxjs';
import { SCREEN_SIZE } from './size-detector.component';

@Injectable({
  providedIn: 'root'
})
export class ResizeChangeService {

  get onResize$(): Observable<SCREEN_SIZE> {
    return this.resizeSubject.asObservable().pipe(distinctUntilChanged());
  }

  private resizeSubject: Subject<SCREEN_SIZE>;

  constructor() {
    this.resizeSubject = new Subject();
  }

  onResize(size: SCREEN_SIZE) {
    this.resizeSubject.next(size);
  }

}
