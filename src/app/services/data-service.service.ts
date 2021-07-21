import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { DateWiseData } from '../models/date-wise-data';
import { globalDataSummary } from '../models/globalData';

@Injectable({
  providedIn: 'root',
})
export class DataServiceService {
  private globalDataUrl =
    'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/11-24-2020.csv';

  private dateWiseDataUrl =
    'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';

  constructor(private http: HttpClient) {}

  getDateWiseData() {
    return this.http.get(this.dateWiseDataUrl, { responseType: 'text' }).pipe(
      map((result) => {
        let rows = result.split('\n');
        // console.log(rows);
        let mainData = {};
        let header = rows[0];
        let dates = header.split(/,(?=\S)/);
        // console.log(dates);
        dates.splice(0, 4);
        // console.log(dates);
        rows.splice(0, 1);
        rows.forEach((row) => {
          let cols = row.split(/,(?=\S)/);
          let con = cols[1]; //country name
          cols.splice(0, 4);
          // console.log(con, cols);
          mainData[con] = [];
          cols.forEach((value, index) => {
            let dw: DateWiseData = {
              cases: +value,
              country: con,
              date: new Date(Date.parse(dates[index])),
            };
            mainData[con].push(dw);
          });
        });

        // console.log(mainData);
        // console.log(result);

        // return result;
        return mainData;
      })
    );
  }

  //We have to explicitly mention here that our response type is not json but csv
  getGlobalData() {
    return this.http.get(this.globalDataUrl, { responseType: 'text' }).pipe(
      map((result, i) => {
        let data: globalDataSummary[] = [];
        let raw = {}; //Here key will be country name and value will be globalDataSummary object
        let rows = result.split('\n');
        rows.splice(0, 1);
        // console.log(rows);
        rows.forEach((row) => {
          // let cols = row.split(','); This was giving error as it was also dividing values which had more than 1 words
          let cols = row.split(/,(?=\S)/);
          // console.log(cols);
          let cs = {
            country: cols[3],
            confirmed: +cols[7], //error here as a string is being returned. We need
            deaths: +cols[8], // a number here. So we append + in front to convert it
            recovered: +cols[9], // into a number
            active: +cols[10],
          };
          let temp: globalDataSummary = raw[cs.country];
          if (temp) {
            //If there is an existing value for key temp, only then
            temp.active = cs.active + temp.active;
            temp.confirmed = cs.confirmed + temp.confirmed;
            temp.deaths = cs.deaths + temp.deaths;
            temp.recovered = cs.recovered + temp.recovered;

            raw[cs.country] = temp;
          } else {
            raw[cs.country] = cs;
          }
          //Before pushing data, we'll insert cs object into raw object.
          // raw[cs.country] = cs; //for the cs.country key, the value is cs object(globalDataSummary)

          // data.push();
        });
        // console.log(raw);
        // console.log(data);

        // console.log(result, i);
        // return result;
        return <globalDataSummary[]>Object.values(raw); //It will return global data object array.
      })
    );
  }
}
