import { Injectable, OnDestroy, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewportService implements OnDestroy {
  private readonly mobileQuery = '(width < 700px)';
  private readonly isMobileSubject = new BehaviorSubject<boolean>(false);
  private mediaQueryList: MediaQueryList | null = null;

  readonly isMobile$ = this.isMobileSubject.asObservable();
  readonly isMobileSignal = signal(false);

  private readonly mediaQueryListener = (event: MediaQueryListEvent): void => {
    this.setMobileState(event.matches);
  };

  constructor() {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    this.mediaQueryList = window.matchMedia(this.mobileQuery);
    this.setMobileState(this.mediaQueryList.matches);
    this.mediaQueryList.addEventListener('change', this.mediaQueryListener);
  }

  get isMobile(): boolean {
    return this.isMobileSubject.value;
  }

  matches(query: string): boolean {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }

    return window.matchMedia(query).matches;
  }

  ngOnDestroy(): void {
    if (this.mediaQueryList) {
      this.mediaQueryList.removeEventListener('change', this.mediaQueryListener);
    }
  }

  private setMobileState(isMobile: boolean): void {
    this.isMobileSubject.next(isMobile);
    this.isMobileSignal.set(isMobile);
  }
}
