import { Injectable } from '@angular/core';

import { IdentificationModel } from '../_models/identification.model';
import { SyntheticColumn } from '../_models/synthetic-column.model';
import { Sye } from '../_models/sye.model';
import { Table } from '../_models/table.model';
import { OccurrenceModel } from '../_models/occurrence.model';
import { EsOccurrenceModel } from '../_models/es-occurrence-model';

import * as _ from 'lodash';
import { EsTableModel } from '../_models/es-table.model';

@Injectable({
  providedIn: 'root'
})
export class IdentificationService {

  tablePreferedRepositoriesId            = ['baseveg', 'pvf2'];
  syePreferedRepositoriesId              = ['baseveg', 'pvf2'];
  relevePreferedRepositoriesId           = ['baseveg', 'pvf2'];
  syntheticColumnPreferedRepositoriesId  = ['baseveg', 'pvf2'];
  idiotaxonPreferedRepositoriesId        = ['bdtfx'];

  constructor() { }

  isATableType(element: any): boolean {
    const type = (el: any): el is Table => true;
    type(element);
    return false;
  }

  isASyeType(element: any): boolean {
    const type = (el: any): el is Sye => true;
    type(element);
    return false;
  }

  isAnOccurrenceType(element: any): boolean {
    const type = (el: any): el is OccurrenceModel => true;
    type(element);
    return false;
  }

  isASyntheticColumnType(element: any): boolean {
    const type = (el: any): el is OccurrenceModel => true;
    type(element);
    return false;
  }

  isAnESOccurrenceType(element: any): boolean {
    const type = (el: any): el is EsOccurrenceModel => true;
    type(element);
    return false;
  }

  isAnESTableType(element: any): boolean {
    const type = (el: any): el is EsTableModel => true;
    type(element);
    return false;
  }

  getFavoriteIdentification(element: Table | Sye | OccurrenceModel | SyntheticColumn | EsOccurrenceModel): IdentificationModel {
    let preferedRepositories: Array<string>;

    if (element && element.identifications) {
      if (element.identifications.length === 0) {
        return null;
      } else if (element.identifications.length === 1) {
        return element.identifications[0];
      } else {

        // Check element type to get suitable preferedRepositories
        if (this.isATableType(element) || this.isAnESTableType(element)) {
          preferedRepositories = this.tablePreferedRepositoriesId;
        } else if (this.isASyeType(element)) {
          preferedRepositories = this.syePreferedRepositoriesId;
        } else if (this.isAnOccurrenceType(element) || this.isAnESOccurrenceType(element)) {
          try {
            const occ = element as OccurrenceModel;
            if (occ.level === 'idiotaxon') {
              // Get an idiotaxon
              preferedRepositories = this.idiotaxonPreferedRepositoriesId;
            } else if (occ.level === 'synusy' || occ.level === 'microcenosis') {
              // Get a synusy or a microcenosis
              preferedRepositories = this.relevePreferedRepositoriesId;
            } else {
              // @Todo implements other types
            }
          } catch (error) {
            return null;
          }
        } else if (this.isASyntheticColumnType(element)) {
          preferedRepositories = this.syntheticColumnPreferedRepositoriesId;
        }
      }

      // Got the prefered repositories according to element type
      if (preferedRepositories == null) { return null; }

      for (const identification of element.identifications) {
        for (const preferedRepo of preferedRepositories) {
          if (identification.repository === preferedRepo) {
            return identification;
          }
        }
      }

      // No prefered identification ?
      return element.identifications.find(x => x !== undefined); // get the first available item (the first item could not be identifications[0] !)

    } else {
      return null;
    }
  }

  getSingleName(element: Table | Sye | OccurrenceModel | SyntheticColumn | EsOccurrenceModel): string {
    const preferedIdentification = this.getFavoriteIdentification(element);
    if (preferedIdentification) {
      if (preferedIdentification.repository === 'otherunknown') {
        return preferedIdentification.citationName && preferedIdentification.citationName !== '' ? preferedIdentification.citationName : '?';
      } else {
        return preferedIdentification.taxonomicalName ? preferedIdentification.taxonomicalName : preferedIdentification.citationName;
      }
    } else {
      return '?';
    }
  }

  /**
   * Remove the Identification ids ('id' and '@id' plus other ld+json values if exists)
   */
  removeIds(identification: IdentificationModel): IdentificationModel {
    const _identification = _.clone(identification);

    if (_identification == null) {
      throw new Error('Can\'t remove identification ids for a non existing identification !');
    }

    if (_identification !== null && _identification.id !== null) {
      // Remove identification id
      _identification.id = null;
    }

    // Remove '@id' property (ld+json support)
    if (_identification['@id'] !== null) {
      delete _identification['@id'];

      // Remove other ld+json fields
      if (_identification['@context'] !== null) { delete _identification['@context']; }
      if (_identification['@type'] !== null) { delete _identification['@type']; }
    }

    return _identification;
  }


}
