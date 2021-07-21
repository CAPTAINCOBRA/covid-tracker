import { Component, OnInit } from '@angular/core';
import { globalDataSummary } from 'src/app/models/globalData';
import { DataServiceService } from 'src/app/services/data-service.service';
// import { GoogleChartInterface } from 'ng2-google-charts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;

  loading = true;

  globalData: globalDataSummary[];
  datatable = [];

  chart = {
    PieChart: 'PieChart',
    ColumnChart: 'ColumnChart',
    // LineChart: 'LineChart',
    height: 500,
    width: 500,
    options: {
      animation: {
        durations: 1000,
        easing: 'out',
      },
      is3D: true,
    },
  };

  // pieChart: GoogleChartInterface = {
  //   chartType: 'PieChart',
  // };
  // columnChart: GoogleChartInterface = {
  //   chartType: 'ColumnChart',
  // };

  constructor(private datatService: DataServiceService) {}

  initChart(caseType: string) {
    // this.datatable.push(['Country', 'Cases']);
    this.datatable = [];
    this.globalData.forEach((cs) => {
      let value: number;
      if (caseType == 'c')
        if (cs.confirmed > 500000) {
          value = cs.confirmed;
        }
      if (caseType == 'a')
        if (cs.active > 50000) {
          value = cs.active;
        }
      if (caseType == 'd')
        if (cs.deaths > 5000) {
          value = cs.deaths;
        }
      if (caseType == 'r')
        if (cs.recovered > 50000) {
          value = cs.recovered;
        }
      this.datatable.push([cs.country, value]);
    });
    console.log(this.datatable);

    // this.pieChart = {
    //   chartType: 'PieChart',
    //   dataTable: datatable,
    //   //firstRowIsData: true,
    //   options: {
    //     height: 500,
    //     // width: 500,
    //   },
    // };

    // this.columnChart = {
    //   chartType: 'ColumnChart',
    //   dataTable: datatable,
    //   //firstRowIsData: true,
    //   options: {
    //     height: 500,
    //     // width: 500,
    //   },
    // };
  }

  ngOnInit(): void {
    this.datatService.getGlobalData().subscribe({
      next: (result) => {
        console.log(result);

        this.globalData = result;
        result.forEach((cs) => {
          if (!Number.isNaN(cs.confirmed)) {
            this.totalActive += cs.active;
            this.totalConfirmed += cs.confirmed;
            this.totalDeaths += cs.deaths;
            this.totalRecovered += cs.active;
            // console.log(this.totalConfirmed);
          }
        });
        this.initChart('c');
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  updateChart(input: HTMLInputElement) {
    console.log(input.value);
    this.initChart(input.value);
  }
}
