import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { OlympicCountry } from '../models/Olympic';


@Injectable({
  providedIn: 'root',
})
export class OlympicService {

  private olympicUrl = './assets/mock/olympic.json';
  //private olympicUrl = '';
  private olympics$ = new BehaviorSubject<OlympicCountry[]>([]);
  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<OlympicCountry[]>(this.olympicUrl).pipe(
        tap((value) => this.olympics$.next(value)),
        catchError((error) => {
            console.error('Error loading initial data:', error);
            // Inform the user
            alert("Une erreur est survenue lors du chargement des données.");
            return of([]);
        })
    );
  }


  getOlympics() {
    return this.olympics$.asObservable();
  }

  getCountryById(id: number): Observable<OlympicCountry | undefined>{
    return this.olympics$.pipe(
      map(olympics => olympics.find(country => country.id === id))
    );
  }
}

