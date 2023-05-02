import { Component, OnInit, Input } from '@angular/core';

import { OccurrenceModel as EsOccurrenceModel } from 'src/app/_models/occurrence.model';

import { IdentificationService } from '../../../_services/identification.service';

import * as _ from 'lodash';


@Component({
  selector: 'vl-occurrence-basic-infos-preview',
  templateUrl: './occurrence-basic-infos-preview.component.html',
  styleUrls: ['./occurrence-basic-infos-preview.component.scss']
})
export class OccurrenceBasicInfosPreviewComponent implements OnInit {
  @Input() occurrence: EsOccurrenceModel;

  constructor(private identificationService: IdentificationService) { }

  ngOnInit() {
  }

  public getObservers(occurrence: EsOccurrenceModel): string {
    if (occurrence && occurrence.vlObservers && occurrence.vlObservers.length > 0) {
      const vlObservers = occurrence.vlObservers;
      const observers = _.map(vlObservers, vlo => vlo.name);

      if (observers && observers.length > 0) {
        return observers.toString();
      } else {
        return '?';
      }
    }
  }

  public getFavoriteIdentification(occurrence: EsOccurrenceModel) {
    this.identificationService.getFavoriteIdentification(occurrence);
  }

}
