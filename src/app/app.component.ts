import {Component, OnInit} from '@angular/core';
import ymaps from 'ymaps';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  map: any;
  points = ['Москва, метро Смоленская', 'Москва, метро Арбатская', [55.734876, 37.59308]];
  suggest: any;
  multiRoute: any;
  address: any = '';

  ngOnInit() {
    ymaps.load('https://api-maps.yandex.ru/2.1/?lang=ru_RU').then(maps => {
      this.map = new maps.Map('map', {
        center: [55.75, 37.6],
        zoom: 8,
        controls: ['geolocationControl', 'zoomControl']
      });
      this.suggest = new maps.SuggestView('suggest');
      this.multiRoute = new maps.multiRouter.MultiRoute({
        referencePoints: this.points
      }, {
        boundsAutoApply: true,
        reverseGeocoding: true,
        viaPointDraggable: true
      });
      this.renderRoute();
    })
      .catch(error => console.log('Failed to load Yandex Maps', error));
  }

  addPoint(point: string) {
    if (point === '') {
      return;
    }
    this.points.push(point);
    this.updateRoute();
    this.geoCoder(point);
    this.address = '';
  }

  dellPoint(i: number) {
    this.points.splice(i, 1);
    this.updateRoute();
  }

  renderRoute() {
    this.map.geoObjects.add(this.multiRoute);
    this.multiRoute.editor.start();
  }

  updateRoute() {
    this.multiRoute.model.setReferencePoints(this.points);
    this.map.options.set('mapStateAutoApply', true);
  }

  addressFind(event: any) {
    this.address = event.target.value;
  }

  geoCoder(point: any) {
    ymaps.load('https://api-maps.yandex.ru/2.1/?lang=ru_RU').then(maps => {
      new maps.geocode(point, {result: 1}).then(res => {
        const result = res.geoObjects.get(0);
        if (point instanceof Array) {
          return result.properties.get('name');
        }
        this.map.setCenter(result.geometry.getCoordinates());
        return result.geometry.getCoordinates();
      }, err => {
        console.log(err);
      });
    });
  }
}
