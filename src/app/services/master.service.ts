import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {NumberOfEmployees} from '../model/master.model';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor(private http: HttpClient) { }

  getInstallationAndDevelopers(): Observable<NumberOfEmployees[]> {
    return this.http.get<NumberOfEmployees[]>('assets/installation-and-developers.json');
  }

  getManufacturing(): Observable<NumberOfEmployees[]> {
    return this.http.get<NumberOfEmployees[]>('assets/manufacturing.json');
  }
}
