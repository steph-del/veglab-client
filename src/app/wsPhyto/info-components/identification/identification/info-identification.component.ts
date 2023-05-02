import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

import { TableService } from 'src/app/_services/table.service';
import { IdentificationService } from '../../../../_services/identification.service';

import { Table } from 'src/app/_models/table.model';
import { Sye } from 'src/app/_models/sye.model';
import { OccurrenceModel } from 'src/app/_models/occurrence.model';

@Component({
  selector: 'vl-phyto-info-identification',
  templateUrl: './info-identification.component.html',
  styleUrls: ['./info-identification.component.scss']
})
export class InfoIdentificationComponent implements OnInit, OnDestroy {
  tableSubscriber: Subscription;
  tableDataviewSubscriber: Subscription;
  table: Table;

  constructor(private tableService: TableService, private identificationService: IdentificationService) { }

  ngOnInit() {
    // Check current table at startup
    const currentTable = this.tableService.getCurrentTable();
    if (currentTable) {
      this.table = currentTable;
    }

    // Subscribe to table change
    this.tableSubscriber = this.tableService.currentTableChanged.subscribe(value => {
      if (value === true) {
        this.table = this.tableService.getCurrentTable();
      }
    });

    // Subscribe to table dataview change (when user move sye positions)
    this.tableDataviewSubscriber = this.tableService.tableDataView.subscribe(value => {
      console.log('TABLE DATAVIEW CHANGED');
      this.table = _.clone(this.tableService.getCurrentTable());
    });
  }

  ngOnDestroy() {
    if (this.tableSubscriber) { this.tableSubscriber.unsubscribe(); }
    if (this.tableDataviewSubscriber) { this.tableDataviewSubscriber.unsubscribe(); }
  }

  isTableEmpty(): boolean {
    if (this.table && this.table.sye && this.table.sye[0].occurrences && this.table.sye[0].occurrences.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  countTableReleves(): number {
    let count = 0;
    if (!this.isTableEmpty()) {
      for (const sye of this.table.sye) {
        count += sye.occurrences.length;
      }
    } else {
      return null;
    }
    return count;
  }

  countRelevesInSye(sye: Sye): number {
    const _sye = this.tableService.getSyeById(this.table, sye.id);
    return sye.occurrences.length;
  }

  getTableIdentification(): string {
    const favoriteIdentification = this.identificationService.getFavoriteIdentification(this.table);
    return favoriteIdentification && favoriteIdentification.validName ? favoriteIdentification.validatedName : 'non identifié';
  }

  getSyeIdentification(sye: Sye): string {
    const favoriteIdentification = this.identificationService.getFavoriteIdentification(sye);
    return favoriteIdentification && favoriteIdentification.validName ? favoriteIdentification.validatedName : 'non identifié';
  }

  getReleveIdentification(releve: OccurrenceModel): string {
    const favoriteIdentification = this.identificationService.getFavoriteIdentification(releve);
    return favoriteIdentification && favoriteIdentification.validName ? favoriteIdentification.validatedName : 'non identifié';
  }

}
