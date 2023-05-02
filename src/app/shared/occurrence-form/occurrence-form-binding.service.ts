import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { OccurrenceService } from '../../_services/occurrence.service';
import { UserService } from '../../_services/user.service';

import { OccurrenceModel } from '../../_models/occurrence.model';
import { RepositoryItemModel } from 'tb-tsb-lib';
import { LocationModel } from 'tb-geoloc-lib/lib/_models/location.model';
import { UserModel } from '../../_models/user.model';
import { ExtendedFieldModel } from 'src/app/_models/extended-field.model';

import { Level } from '../../_enums/level-enum';
import { LayerEnum as Layer } from '../../_enums/layer-list';
import { InputSource } from '../../_enums/input-source-enum';

import * as _ from 'lodash';
import { FieldDataType } from 'src/app/_enums/field-data-type-enum';
import { DateAdapter } from '@angular/material';
import { LocationAccuracy } from 'src/app/_enums/location-accuracy-enum';

@Injectable({
  providedIn: 'root'
})
export class OccurrenceFormBindingService {
  xOccurrence: OccurrenceModel;

  constructor(private occurenceService: OccurrenceService,
              private userService: UserService,
              private dateAdapter: DateAdapter<any>) { }

  bindOccurrenceData(citedSyntaxon: RepositoryItemModel, level: Level, location: LocationModel, occurrences: Array<{ layer: string, taxa: RepositoryItemModel, coef: string }>, form: FormGroup, user: UserModel, metadatas: Array<{metadata: ExtendedFieldModel, control: FormControl}>): OccurrenceModel {
    const currentVlUser = this.userService.currentVlUser.getValue();
    //
    // SYNUSY
    //
    if (level === Level.SYNUSY) {
      //
      // X-Occurrence : Parent (SYNUSY level)
      //
      this.xOccurrence = this.occurenceService.getFreshOccurrence();
      this.xOccurrence.level = Level.SYNUSY;
      this.xOccurrence.layer = form.controls.layer.value;
      this.xOccurrence.parentLevel = null;
      let xIdTaxo = null;
      if (citedSyntaxon !== null && citedSyntaxon.idTaxo !== null) { xIdTaxo = citedSyntaxon.idTaxo.toString(); }
      if (xIdTaxo === null && citedSyntaxon !== null && citedSyntaxon.validOccurence.idTaxo !== null) { xIdTaxo =  citedSyntaxon.validOccurence.idTaxo.toString(); }
      // bind identification
      if (citedSyntaxon && citedSyntaxon !== null) {
        this.xOccurrence.identifications = [{
          validatedBy: user.id,
          validatedAt: new Date(),
          owner: currentVlUser,
          repository: citedSyntaxon.repository,
          repositoryIdNomen: +citedSyntaxon.idNomen,
          repositoryIdTaxo: xIdTaxo,
          inputName: citedSyntaxon.name + ' ' + citedSyntaxon.author,
          validName: citedSyntaxon.validOccurence.name + ' ' + citedSyntaxon.validOccurence.author,
          validatedName: citedSyntaxon.validOccurence.name + ' ' + citedSyntaxon.validOccurence.author
        }];
      }
      // bind occurrences-shared data
      this.bindSharedData(this.xOccurrence, form, user, location, metadatas);

      //
      // Y-Occurrences : Children (IDIOTAXON level)
      //
      for (const occ of occurrences) {
        const yOcc = this.occurenceService.getFreshOccurrence();
        yOcc.level = Level.IDIOTAXON;
        yOcc.layer = this.xOccurrence.layer;
        yOcc.parentLevel = this.xOccurrence.level;
        let yIdTaxo = null;
        if (occ.taxa.idTaxo !== null) { yIdTaxo = occ.taxa.idTaxo.toString(); }
        if (yIdTaxo === null && occ.taxa.validOccurence !== null && occ.taxa.validOccurence.idNomen !== null) { yIdTaxo =  occ.taxa.validOccurence.idNomen.toString(); }
        yOcc.identifications = [{
          validatedBy: user.id,
          validatedAt: new Date(),
          owner: currentVlUser,
          repository: occ.taxa.repository,
          repositoryIdNomen: +occ.taxa.idNomen,
          repositoryIdTaxo: yIdTaxo,
          inputName: occ.taxa.name + ' ' + occ.taxa.author,
          validName: occ.taxa.validOccurence ? occ.taxa.validOccurence.name + ' ' + occ.taxa.validOccurence.author : null,
          validatedName: occ.taxa.validOccurence ? occ.taxa.validOccurence.name + ' ' + occ.taxa.validOccurence.author : null
        }];
        yOcc.coef = occ.coef;
        this.bindSharedData(yOcc, form, user, location, metadatas);

        // attach yOcc to xOcurrence
        this.xOccurrence.children.push(yOcc);
      }

    //
    // MICROCENOSIS
    //
    } else if (level === Level.MICROCENOSIS) {
      //
      // X-Occurrence : Grand-Parent (MICROCENOSIS level)
      //
      this.xOccurrence = this.occurenceService.getFreshOccurrence();
      this.xOccurrence.level = Level.MICROCENOSIS;
      this.xOccurrence.children = [];
      this.xOccurrence.layer = null;
      this.xOccurrence.parentLevel = null;
      let xIdTaxo = null;
      if (citedSyntaxon !== null && citedSyntaxon.idTaxo !== null) { xIdTaxo = citedSyntaxon.idTaxo.toString(); }
      if (xIdTaxo === null && citedSyntaxon !== null && citedSyntaxon.validOccurence.idTaxo !== null) { xIdTaxo =  citedSyntaxon.validOccurence.idTaxo.toString(); }
      // bind identification
      if (citedSyntaxon && citedSyntaxon !== null) {
        this.xOccurrence.identifications = [{
          validatedBy: user.id,
          validatedAt: new Date(),
          owner: currentVlUser,
          repository: citedSyntaxon.repository,
          repositoryIdNomen: +citedSyntaxon.idNomen,
          repositoryIdTaxo: xIdTaxo,
          inputName: citedSyntaxon.name + ' ' + citedSyntaxon.author,
          validName: citedSyntaxon.validOccurence.name + ' ' + citedSyntaxon.validOccurence.author,
          validatedName: citedSyntaxon.validOccurence.name + ' ' + citedSyntaxon.validOccurence.author
        }];
      }
      // bind occurrences-shared data
      this.bindSharedData(this.xOccurrence, form, user, location, metadatas);

      //
      // Y-Occurrences : Parents (SYNUSY level)
      //
      const yOccur = _.groupBy(occurrences, 'layer');
      // tslint:disable-next-line:forin
      for (const levelKey in yOccur) {
        const yOcc = this.occurenceService.getFreshOccurrence();
        yOcc.level = Level.SYNUSY;
        yOcc.identifications = [];
        yOcc.children = [];
        yOcc.parentLevel = this.xOccurrence.level;
        this.bindSharedData(yOcc, form, user, location, metadatas);

        const yOccurrence = yOccur[levelKey];

        yOccurrence.forEach(z => {
          const zOcc = this.occurenceService.getFreshOccurrence();
          zOcc.level = Level.IDIOTAXON;
          yOcc.layer = z.layer as Layer;
          zOcc.layer = z.layer as Layer;
          zOcc.parentLevel = yOcc.level;
          zOcc.coef = z.coef;
          let zIdTaxo = null;
          if (z.taxa.idTaxo !== null) { zIdTaxo = z.taxa.idTaxo.toString(); }
          if (zIdTaxo === null && z.taxa.validOccurence !== null && z.taxa.validOccurence.idNomen !== null) { zIdTaxo =  z.taxa.validOccurence.idNomen.toString(); }
          zOcc.identifications = [{
            validatedBy: user.id,
            validatedAt: new Date(),
            owner: currentVlUser,
            repository: z.taxa.repository,
            repositoryIdNomen: +z.taxa.idNomen,
            repositoryIdTaxo: zIdTaxo,
            inputName: z.taxa.name + ' ' + z.taxa.author,
            validName: z.taxa.validOccurence ? z.taxa.validOccurence.name + ' ' + z.taxa.validOccurence.author : null,
            validatedName: z.taxa.validOccurence ? z.taxa.validOccurence.name + ' ' + z.taxa.validOccurence.author : null
          }];
          this.bindSharedData(zOcc, form, user, location, metadatas);

          yOcc.children.push(zOcc);
        });

        this.xOccurrence.children.push(yOcc);
      }
    }

    return this.xOccurrence;
  }

  private bindSharedData(occ: OccurrenceModel, form: FormGroup, user: UserModel, location: LocationModel, metadatas: Array<{metadata: ExtendedFieldModel, control: FormControl}>): void {
    this.bindDateData(occ, form);
    this.bindLocationData(occ, location);
    this.bindInputSource(occ);
    this.bindUserAndObserverData(occ, form, user);
    this.bindMetadata(occ, metadatas);
  }

  private bindUserAndObserverData(occ: OccurrenceModel, formData: FormGroup, user: UserModel) {
    // get current vlUser
    const cu = this.userService.currentVlUser.getValue();
    if (cu === null) {
      console.log('Current user is null');
      return;
    }

    console.log('CURRENT VL USER', cu);

    occ.userId = user.id;
    occ.userEmail = user.email;
    occ.userPseudo = user ? this.userService.getUserFullName() : null;
    occ.userProfile = [];
    occ.owner = cu;

    occ.observer = formData.controls.observer.value;
    occ.observerInstitution = formData.controls.observerInstitution.value;
  }

  private bindDateData(occ: OccurrenceModel, formData: FormGroup) {
    occ.dateCreated = new Date();
    occ.dateObserved = formData.controls.dateObserved.value;
  }

  private bindLocationData(occ: OccurrenceModel, location: LocationModel): void {
    occ.vlLocationInputSource = location.inputLocation !== null ? location.inputLocation : null;
    occ.vlLocationAccuracy = location.vlLocationAccuracy ? location.vlLocationAccuracy : null;
    occ.elevation = location.elevation;
    // occ.geodatum = location.geodatum;
    occ.geometry = JSON.stringify(location.geometry);
    occ.centroid = location.centroid ? JSON.stringify(location.centroid) : null;
    occ.locality = location.locality;
    occ.localityConsistency = location.localityConsistency;
    // occ.locationAccuracy = 1;
    occ.osmCountry = location.osmCountry;
    occ.osmCountryCode = location.osmCountryCode;
    occ.osmCounty = location.osmCounty;
    occ.osmId = location.osmId.toString();
    occ.osmPlaceId = location.osmPlaceId;
    occ.osmPostcode = location.osmPostcode.toString();
    occ.osmState = location.osmState;
    // occ.publishedLocation = 'précise';
  }

  private bindInputSource(occ: OccurrenceModel): void {
    occ.inputSource = InputSource.VEGLAB;
  }

  private bindMetadata(occ: OccurrenceModel, metadatas: Array<{metadata: ExtendedFieldModel, control: FormControl}>) {
    occ.extendedFieldOccurrences = [];
    // this.dateAdapter.format(this.dateFilterMinValueControl.value, 'DD/MM/YYYY')
    metadatas.forEach(metadataContext => {
      // if value id a date, format it as 'dd/mm/yy'
      const value = metadataContext.metadata.dataType === FieldDataType.DATE ?  this.dateAdapter.format(metadataContext.control.value, 'DD/MM/YYYY') : metadataContext.control.value.toString();
      occ.extendedFieldOccurrences.push({
        id: null,
        occurrence: null,
        extendedField: metadataContext.metadata,
        value
      });
    });
  }
}
