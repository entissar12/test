import { Component } from '@angular/core';

import {NavController} from 'ionic-angular';

import { BackendService } from '../../providers/backendService';
import {TranslateService} from "ng2-translate";

@Component({
    selector: 'page-stats',
    templateUrl: 'stats.html'
})
export class StatsPage {
    chartOptions: any;
    constructor(public navCtrl: NavController,
                public backendService: BackendService,
                public translate: TranslateService
    ) {
        this.load_chart_category();
    }

    load_chart_month() {
        var date = new Date();
        var chart_months = [],
            englishMonthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
            arabicMonthNames = [ "جانفي", "فيفري", "مارس", "أفريل", "ماي", "جوان", "جويلية", "أوت", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر" ];
        var chart_data = [];
        date.setMonth(date.getMonth() - 5);
        for(var i = 0; i < 6; i++) {
            if (localStorage.getItem('lang') == 'en') {
                chart_months.push(englishMonthNames[date.getMonth()] + ' ' + date.getFullYear());
            } else {
                chart_months.push(arabicMonthNames[date.getMonth()] + ' ' + date.getFullYear());
            }
            let month = date.getFullYear() +'-'+ (date.getMonth() +1).toString() ;
            console.log(month);
            this.backendService.countViolationsPerMonth(month)
                .subscribe(
                    data => {
                        chart_data.push(data.length);
                        this.chartOptions = {
                            chart : {
                                type: 'column'
                            },
                            title: {
                                text: 'Violations'
                            },
                            xAxis: {
                                categories: chart_months,
                                crosshair: true
                            },
                            yAxis: {
                                min: 0,
                                plotLines: [{
                                    value: 0,
                                    width: 1,
                                    color: '#888122'
                                }]
                            },
                            legend: {
                                layout: 'horizontal',
                                borderWidth: 0
                            },
                            series: [{
                                name: 'Month',
                                data: chart_data
                            }]
                        };

                    },
                    err => {
                        console.log(err);
                    },
                    () => {
                        console.log('done ! ');
                    }
                );
            date.setMonth(date.getMonth() + 1);
        }
    }
    load_chart_category() {
      var categories = [];
      var chart_categories = [];
      var chart_data = [];
      this.backendService.getCategories()
        .subscribe(
          data => {
            categories = data;
            for (var i = 0; i < categories.length; i++) {
              if (localStorage.getItem('lang') == 'en') {
                chart_categories.push(categories[i].english_name);
              } else {
                chart_categories.push(categories[i].arabic_name);
              }
              this.backendService.countViolations(categories[i].id)
                .subscribe(
                  data => {
                    chart_data.push(data.length);
                    this.chartOptions = {
                      chart: {
                        type: 'column'
                      },
                      title: {
                        text: 'Violations'
                      },
                      xAxis: {
                        categories: chart_categories,
                        crosshair: true
                      },
                      yAxis: {
                        min: 0,
                        plotLines: [{
                          value: 0,
                          width: 1,
                          color: '#808080'
                        }]
                      },
                      legend: {
                        layout: 'horizontal',
                        borderWidth: 0
                      },
                      series: [{
                        name: 'Categorie',
                        data: chart_data
                      }]
                    }
                  },
                  err => {
                    console.log(err);
                  },
                  () => {
                    console.log('done ! ');
                  }
                );
            }
          },
          err => console.log(err),
          () => console.log('Categories fetched in stats !')
        );
    }
}
