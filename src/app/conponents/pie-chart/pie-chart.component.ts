import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, count, map, takeUntil } from 'rxjs';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { Input } from '@angular/core';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { Participation } from 'src/app/core/models/Participation';
import { Router } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit, OnDestroy {

  //Lists of countries
  olympicCountries$!: Observable<OlympicCountry[]>;
  totalParticipation: number = 0;
  canDisplay: boolean = false;
  //For labels
  nbOfJOs: number = 0;
  nbOfCountries: number = 0;
  private destroy$ = new Subject<boolean>();

  constructor(private router: Router,private olympicService: OlympicService) { }

  ngOnInit(): void {
    
    this.olympicService.loadInitialData().pipe(takeUntil(this.destroy$)).subscribe(() => {
      //Get countries data
      this.olympicCountries$ = this.olympicService.getOlympics();
      //Set data to pie chart
      this.updateChart();
    });


  }

  //Display piechar options
  chartOptions = {
    animationEnabled: true,
    title: {
      //text: "Medals per Country"
    },
    data: [{
      type: "pie",
      startAngle: -90,
      indexLabel: "{name}: {y}",
      click: (e: { dataPoint: { name: string; }; }) =>{
        if (e && e.dataPoint) {
          this.chartClicked(e.dataPoint.name);
        }
      },
      dataPoints: [] as { y: number; name: string; }[]
    }],
  }

  //Modifie pie char values and labels
  updateChart():void {
    this.olympicCountries$.pipe(takeUntil(this.destroy$)).subscribe(countries => {
      const dataPoints = countries.map(country => ({
        y: country.participations.reduce((total, participation) => total + participation.medalsCount, 0),
        name: country.country
      }));
      this.chartOptions.data[0].dataPoints = dataPoints;
      this.canDisplay = true;
    });
    this.fillLabels();
  }

  //Click on a country
  chartClicked(countryName: string):void {
    this.olympicCountries$.pipe(takeUntil(this.destroy$)).subscribe(countries => {
      //get coutnry info
      const country = countries.find(c => c.country === countryName);
      if (country) {
        //go to coutnry details
        this.router.navigate(['country/', country.id]);
      }
    });
  }

  //Put values in labels
  fillLabels():void {
    let years: number[] = [];
    this.olympicCountries$.pipe(takeUntil(this.destroy$)).subscribe(countries => {
      countries.forEach(country => {
        country.participations.forEach(participation => {
          if (!years.find(y => y == participation.year)) {
            years.push(participation.year);
          }
        });
      });
      this.nbOfJOs = years.length;
      this.nbOfCountries = countries.length;
    });
  }

  //To destroy obeservables
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}


