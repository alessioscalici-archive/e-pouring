import { Injectable } from '@angular/core';



@Injectable()
export class AppConfig {

   static pouring = {
       tickFrequency: 50,
       bubbleDuration: 50,
       ozQuarterDuration: 350,
       maximumCorrectInclination: -6.5,

       inclination: {

           neutral: {
               min: 0,
               max: 0.5235987755982987  // ~ PI / 2  ( 1 quarter )
           },
           wrong: {
               min: 0.5235987755982988, // PI / 2 ( 1 quarter )
               max: 2.6179938779914943  // ~ PI - PI / 6 ( 5 quarters)
           },
           correct: {
               min: 2.6179938779914944, // PI / 2 ( 1 quarter )
               max: 3.141592653589793   // PI ( 6 quarters)
           }
       }

   };



}