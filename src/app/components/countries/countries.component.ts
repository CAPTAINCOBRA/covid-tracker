import { Component, OnInit } from '@angular/core';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateWiseData } from 'src/app/models/date-wise-data';
import { globalDataSummary } from 'src/app/models/globalData';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css'],
})
export class CountriesComponent implements OnInit {
  data: globalDataSummary[]; //An array of globalDataSummary objects
  countries: string[] = [];
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  selectedCountryData: DateWiseData[];
  dateWiseData;

  loading = true;

  datatable = [];

  chart = {
    // PieChart: 'PieChart',
    // ColumnChart: 'ColumnChart',
    LineChart: 'LineChart',
    height: 500,
    width: 500,
    options: {
      animation: {
        startup: true,
        durations: 1000,
        easing: 'out',
      },
      is3D: true,
    },
  };

  constructor(private service: DataServiceService) {}

  ngOnInit(): void {
    merge(
      //To have a default value, we merged these 2 methods and commented the ones written below
      this.service.getDateWiseData().pipe(
        map((result) => {
          this.dateWiseData = result;
        })
      ),
      this.service.getGlobalData().pipe(
        map((result) => {
          this.data = result;
          this.data.forEach((cs) => {
            this.countries.push(cs.country);
          });
        })
      )
    ).subscribe({
      complete: () => {
        this.updateValues('India');
        this.loading = false;
      },
    });

    // this.service.getDateWiseData().subscribe((result) => {
    //   // console.log(result);
    //   this.dateWiseData = result;
    //   this.updateChart();
    //   // console.log(this.dateWiseData);
    // });

    // this.service.getGlobalData().subscribe((result) => {
    //   this.data = result;
    //   this.data.forEach((cs) => {
    //     this.countries.push(cs.country);
    //   });
    // });
  }

  updateChart() {
    this.datatable = [];
    // this.datatable.push(['Date', 'cases']);
    this.selectedCountryData.forEach((cs) => {
      this.datatable.push([cs.date, cs.cases]);
    });

    // dataTable: datatable;
    console.log(this.datatable);
  }

  updateValues(country: string) {
    console.log(country);
    this.data.forEach((cs) => {
      if (cs.country == country) {
        this.totalActive = cs.active;
        this.totalDeaths = cs.deaths;
        this.totalRecovered = cs.recovered;
        this.totalConfirmed = cs.confirmed;
      }
    });

    this.selectedCountryData = this.dateWiseData[country];
    // console.log(this.selectedCountryData);
    this.updateChart();
  }
}
