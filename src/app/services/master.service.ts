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

  geSalesAndDistribution(): Observable<NumberOfEmployees[]> {
    return this.http.get<NumberOfEmployees[]>('assets/sales-and-distribution.json');
  }

  getOperationsAndMaintenance(): Observable<NumberOfEmployees[]> {
    return this.http.get<NumberOfEmployees[]>('assets/operations-and-maintenance.json');
  }

  getOther(): Observable<NumberOfEmployees[]> {
    return this.http.get<NumberOfEmployees[]>('assets/other.json');
  }

  getNewIntraday(): Observable<[number, number, number, number, number][]> {
    return this.http.get<[number, number, number, number, number][]>('assets/new-intraday.json');
  }
}
