import { Component, OnInit, Input, Inject } from '@angular/core';

import { OccurrenceModel as EsOccurrenceModel } from 'src/app/_models/occurrence.model';
import { IdentificationModel } from '../../../_models/identification.model';

import { MomentLocalDatePipe } from 'src/app/_pipes/moment-local-date.pipe';

import { IdentificationService } from '../../../_services/identification.service';

import * as _ from 'lodash';

@Component({
  selector: 'vl-occurrence-identifications-preview',
  templateUrl: './occurrence-identifications-preview.component.html',
  styleUrls: ['./occurrence-identifications-preview.component.scss']
})
export class OccurrenceIdentificationsPreviewComponent implements OnInit {
  @Input() occurrence: EsOccurrenceModel;

  identifications: Array<IdentificationModel> = [];
  emptyIdentifications: boolean;

  constructor(private datePipe: MomentLocalDatePipe) { }

  ngOnInit() {
    console.log('OCC IDENTIFICATION', this.occurrence);
  }

  private getIdentifications(occurrence: EsOccurrenceModel): Array<IdentificationModel> {
    let identifications: Array<IdentificationModel> = null;
    const result: Array<{repo: string, name: string, validatedBy: number, validatedAt: any}> = [];

    if (occurrence !== null && occurrence.identifications && occurrence.identifications.length > 0) {
      identifications = occurrence.identifications;
    }

    return identifications;
  }

  isIdentificationsEmpty(occurrence: EsOccurrenceModel): boolean {
    if (occurrence !== null) {
      const identifications = occurrence.identifications;
      if (identifications == null || (identifications && identifications.length === 0)) { return true; }
      let result = true;
      for (const identification of identifications) {
        if (identification.validatedBy == null
            && identification.validatedAt == null
            && identification.updatedBy == null
            && identification.updatedAt == null
            && identification.repository == null
            && identification.repositoryIdNomen == null
            && identification.repositoryIdTaxo == null
            && identification.citationName == null
            && identification.taxonomicalName == null
            && identification.nomenclaturalName == null) {
              result = true;
            } else {
              result = false;
            }
      }
      return result;
    } else  {
      return true;
    }
  }

  getIdentificationName(identification: IdentificationModel): string {
    if (identification !== null) {
      if (identification.repository === 'otherunknonw') {
        return identification.citationName;
      } else if (identification.repository !== 'otherunknonwn') {
        return identification.taxonomicalName;
      } else {
        return '?';
      }
    } else {
      return 'non identifié';
    }
  }

  getIdentificationAuthor(identification: IdentificationModel): string {
    if (identification !== null) {
      if (identification.updatedBy) {
        return identification.updatedBy.toString();   // @Todo show name instead of user id
      } else if (identification.validatedBy) {
        return identification.validatedBy.toString(); // @Todo show name instead of user id
      } else  {
        return '?';
      }
    } else {
      return '-';
    }
  }

  getIdentificationDate(identification: IdentificationModel): string {
    if (identification !== null) {
      if (identification.updatedAt) {
        return this.datePipe.transform(identification.updatedAt);
      } else if (identification.validatedAt) {
        return this.datePipe.transform(identification.validatedAt);
      } else  {
        return '?';
      }
    } else {
      return '-';
    }
  }

}
