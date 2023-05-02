import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IdentificationModel } from '../../_models/identification.model';

import { OccurrenceModel } from 'src/app/_models/occurrence.model';
import { Sye } from 'src/app/_models/sye.model';
import { SyntheticColumn } from 'src/app/_models/synthetic-column.model';
import { Table } from 'src/app/_models/table.model';
import { UserModel } from 'src/app/_models/user.model';

import { UserService } from 'src/app/_services/user.service';

import * as _ from 'lodash';

@Component({
  selector: 'vl-identification-inline',
  templateUrl: './identification-inline.component.html',
  styleUrls: ['./identification-inline.component.scss']
})
export class IdentificationInlineComponent implements OnInit {
  @Input() set element(value: OccurrenceModel | Sye | Table | SyntheticColumn) {
    this._element = _.clone(value);
    if (value && value.identifications) {
      this.identifications = value.identifications;
    }
  }
  @Input() allowDelete = false;

  @Output() elementToDelete = new EventEmitter<IdentificationModel>();

  currentUser: UserModel; // SSO user
  _element: OccurrenceModel | Sye | Table | SyntheticColumn = null;
  identifications: Array<IdentificationModel> = [];
  myIdentifications: Array<IdentificationModel> = undefined;
  otherIdentifications: Array<IdentificationModel> = [];
  showAllIdentifications = false;

  constructor(private userService: UserService) { }

  ngOnInit() {
    // Get current user
    this.currentUser = this.userService.currentUser.getValue();

    // Set identification lists
    this.myIdentifications = this.currentUser && this.currentUser.id ? _.filter(this.identifications, v => v.owner.id === this.currentUser.id) : [];
    this.otherIdentifications = _.difference(this.identifications, this.myIdentifications);
  }

  toggleShowAllIdentifications() {
    if (this.showAllIdentifications === false &&
        ((this.myIdentifications.length > 0 && this.otherIdentifications.length > 1) ||
        (this.myIdentifications.length === 0 && this.otherIdentifications.length > 2))) {
      this.showAllIdentifications = true  ;
    } else if (this.showAllIdentifications === true) {
      this.showAllIdentifications = false;
    }
  }

  deleteElement(identification: IdentificationModel): void {
    this.elementToDelete.emit(identification);
  }

}
