import { Injectable } from '@angular/core';
import { SyntheticColumn } from '../_models/synthetic-column.model';

import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class SyntheticColumnService {

  constructor() { }

  /*getReadableCoef(type: string, sum: number, nbItems: number, minCoef: string, maxCoef: string): string {
    const freq = (nbItems * 100) / sum;

    switch (type) {
      case 'roman':
        return nbItems && nbItems <= 5 ? nbItems.toString() : this.getRomanCoef(freq);
      case 'romanMinMax':
        return this.getRomanCoef(freq) + (minCoef === maxCoef ? minCoef : minCoef + maxCoef);
      case 'percent':
        return Math.round(freq).toString() + '%';
      default:
        return nbItems.toString();
    }
  }*/

  getSyntheticCoef(frequency: number, countTotalOccurrences: number, countRealOccurrences: number): string {
    if (countTotalOccurrences <= 5) {
      return countRealOccurrences.toString();
    } else {
      return this.getRomanCoef(frequency);
    }
  }

  getRomanCoef(frequency: number): string {
    switch (true) {
      case (frequency < 5):
        return '+';
      case (frequency >= 5 && frequency < 10):
        return 'I';
      case (frequency >= 10 && frequency < 25):
        return 'II';
      case (frequency >= 25 && frequency < 50):
        return 'III';
      case (frequency >= 50 && frequency < 75):
        return 'IV';
      case (frequency >= 75):
        return 'V';
      default:
        return '?';
    }
  }

  /**
   * Remove the SyntheticColumn ids + Synthetic items ids ('id' and '@id' plus other ld+json values if exists)
   */
  removeIds(sc: SyntheticColumn): SyntheticColumn {
    const _sc = _.clone(sc);

    if (_sc == null) {
      throw new Error('Can\'t remove synthetic column ids for a non existing synthetic column !');
    }

    if (_sc !== null && _sc.id !== null) {
      // Remove synthethic column id
      _sc.id = null;
    }

    // Remove '@id' property (ld+json support)
    if (_sc['@id'] !== null) {
      delete _sc['@id'];

      // Remove other ld+json fields
      if (_sc['@context'] !== null) { delete _sc['@context']; }
      if (_sc['@type'] !== null) { delete _sc['@type']; }
    }

    // Remove synthetic items ids
    for (let i = 0; i < _sc.items.length; i++) {
      const scItem = _sc.items[i];
      if (scItem.id !== null) {
        scItem.id = null;
        if (scItem['@id'] !== null) {
          delete scItem['@id'];

          if (scItem['@context'] !== null) { delete scItem['@context']; }
          if (scItem['@type'] !== null) { delete scItem['@type']; }
        }
      }
    }

    return _sc;
  }

}
