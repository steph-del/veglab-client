import { Component, OnInit, Input } from '@angular/core';
import { EsTableModel } from 'src/app/_models/es-table.model';
import { IdentificationModel } from '../../../_models/identification.model';

import { IdentificationService } from '../../../_services/identification.service';

import * as _ from 'lodash';

@Component({
  selector: 'vl-table-identifications-preview',
  templateUrl: './table-identifications-preview.component.html',
  styleUrls: ['./table-identifications-preview.component.scss']
})
export class TableIdentificationsPreviewComponent implements OnInit {
  @Input() set table(value: EsTableModel) {
    this.identifications = _.clone(this.setIdentifications(value));
  }

  identifications: any;

  constructor(private identificationService: IdentificationService) { }

  ngOnInit() { }

  setIdentifications(table: EsTableModel): any {
    let data = null;
    if (table && table.identifications) {
      if (typeof(table.identifications) === 'string') {
        data = JSON.parse(table.identifications);
      } else if (typeof(table.identifications) === 'object') {
        data = table.identifications;
      }
    }

    const identifications: Array<any> = [];

    identifications.push({element: 'table', label: 'Tableau', value: data.table});
    for (const sye of data.syes) {
      identifications.push({element: 'sye', label: 'Sye', value: sye});
      for (const releve of sye.releves) {
        identifications.push({element: 'releve', label: 'Relevé', value: releve});
      }
    }
    return identifications;
  }

  getIdentificationLabel(element: 'table' | 'sye' | 'releve', identifications: Array<IdentificationModel>): string {
    /*const favoriteIdentification = this.identificationService.getFavoriteIdentification(element, identifications);
    if (preferedIdentifi) {
      return favoriteIdentification.validatedName;
    } else {
      return 'Non identifié';
    }*/

    // @ TODO implements ; Before, check ES table model : identifications are empty !!
    return '--';
  }

}
