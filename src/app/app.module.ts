import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PieChartComponent } from './conponents/pie-chart/pie-chart.component';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { DetailsComponent } from './conponents/details/details.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, NotFoundComponent, PieChartComponent, DetailsComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule,CanvasJSAngularChartsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
