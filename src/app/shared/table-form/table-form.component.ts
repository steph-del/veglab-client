import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { UserService } from 'src/app/_services/user.service';
import { TableService } from 'src/app/_services/table.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { PdfFileService } from 'src/app/_services/pdf-file.service';

import { Table } from 'src/app/_models/table.model';
import { IdentificationModel } from '../../_models/identification.model';
import { PdfFile } from 'src/app/_models/pdf-file.model';
import { TableRelatedSyntaxon } from 'src/app/_models/table-related-syntaxon';
import { UserModel } from 'src/app/_models/user.model';
import { VlUser } from 'src/app/_models/vl-user.model';

import { RepositoryItemModel } from 'tb-tsb-lib';
import { FileData } from 'tb-dropfile-lib/lib/_models/fileData';

import * as _ from 'lodash';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { sanitizeStyle } from '@angular/core/src/sanitization/sanitization';

@Component({
  selector: 'vl-table-form',
  templateUrl: './table-form.component.html',
  styleUrls: ['./table-form.component.scss']
})
export class TableFormComponent implements OnInit, OnDestroy {
  @Input() title = 'Enregistrer le tableau';

  // ---
  // VAR
  // ---
  tableForm: FormGroup;
  maxTitleLength = 100;
  maxDescriptionLength = 300;
  currentUser: UserModel;
  currentVlUser: VlUser;
  userSubscription: Subscription;
  vlUserSubscription: Subscription;
  relatedSyntaxon: Array<RepositoryItemModel> = [];
  relatedPdfFile: Array<FileData> = [];
  allowedUploadedFileTypes = ['pdf'];

  pdfFilesToSend: Array<FormData> = [];
  pdfFileIrisToLink: Array<string> = [];
  currentTablePdfFiles: Array<PdfFile> = [];
  // pdfFileIrisToUnlink: Array<string> = [];

  uploadingPdf = false;
  postingOrPutingTable = false;

  constructor(
    private userService: UserService,
    public tableService: TableService,
    private pdfFileService: PdfFileService,
    private notificationService: NotificationService,
    private router: Router) { }

  ngOnInit() {
    // Get current user
    this.currentUser = this.userService.currentUser.getValue();
    this.currentVlUser = this.userService.currentVlUser.getValue();
    if (this.currentUser == null) {
      // No user
      // Should refresh the token ?
      // this.notificationService.warn('Il semble que vous ne soyez plus connecté. Nous ne pouvons pas poursuivre l\'enregistrement du tableau.');
      // return;
    }

    // Subscribe to current user
    this.userSubscription = this.userService.currentUser.subscribe(
      user => {
        this.currentUser = user;
      },
      error => {
        // @Todo manage error
      }
    );
    this.vlUserSubscription = this.userService.currentVlUser.subscribe(
      vlUser => {
        this.currentVlUser = vlUser;
      }, error => { console.log(error); }
    );

    this.tableForm = new FormGroup({
      createdAt: new FormControl({value: new Date(), disabled: true}, [Validators.required]),
      // createdBy: new FormControl(user, [Validators.required]),
      isDiagnosis: new FormControl(false, [Validators.required]),
      title: new FormControl(''),
      description: new FormControl(''),
      biblioSource: new FormControl('')
    });

    // if current table has id -> bind form
    const ct = this.tableService.getCurrentTable();
    if (!this.tableService.isTableEmpty(ct) && ct.id) {
      this.bindForm(ct);
    }

    // if current table has pdf file
    if (!this.tableService.isTableEmpty(ct) && ct.pdf) {
      this.currentTablePdfFiles.push(ct.pdf);
    }
  }

  ngOnDestroy() {
    if (this.userSubscription) { this.userSubscription.unsubscribe(); }
  }

  syntaxonChange(rim: RepositoryItemModel): void {
    if (this.relatedSyntaxon.length > 0) {
      this.notificationService.warn('Un tableau ne peut contenir qu\'une seule identification');
    } else {
      const alreadyExist = _.find(this.relatedSyntaxon, rs => _.isEqual(rs, rim));
      if (alreadyExist) {
        this.notificationService.warn('Vous ne pouvez pas ajouter deux fois la même référence');
      } else {
        this.relatedSyntaxon.push(rim);
      }
    }
  }

  deleteSyntaxon(data: TableRelatedSyntaxon): void {
    _.remove(this.relatedSyntaxon, rs => _.isEqual(rs, data));
  }

  deleteRelatedPdfFile(data: FileData): void {
    this.pdfFilesToSend = [];
    this.relatedPdfFile = [];
  }

  deleteTablePdfFile(pdfFile: PdfFile): void {
    _.remove(this.currentTablePdfFiles, pf => _.isEqual(pf, pdfFile));
  }

  deleteBilbioSource(data: TableRelatedSyntaxon): void {
    //
  }

  /**
   * On PDF file upload
   * @param data see tb-dropfile-lib output event
   */
  pdfUploaded(data: FileData): void {
    this.relatedPdfFile = [data[0]];
    try {
      const fd = this.createFormDataForPdfFile([this.relatedPdfFile[0].file]);
      this.pdfFilesToSend[0] = fd;
    } catch (error) {
      console.log(error);
    }
  }

  private createFormDataForPdfFile(files: Array<File>): FormData {
    const fd = new FormData();
    for (const file of files) {
      fd.append('file', file, file.name);
    }
    return fd;
  }

  /**
   * POST pdf files trough API and then POST / PUT table
   */
  postPdfFiles(callback: 'POST' | 'PUT') {
    if (this.pdfFilesToSend.length > 0) {
      this.uploadingPdf = true;
      this.pdfFileService.createPdfFile(this.pdfFilesToSend[0]).subscribe(
        pdfFile => {
          this.uploadingPdf = false;
          this.postingOrPutingTable = true;
          this.pdfFileIrisToLink.push(pdfFile['@id']);
          if (callback === 'POST') { this.postTable(); }
          if (callback === 'PUT') { this.putTable(); }
        }, errorPdfFile => {
          this.notificationService.error('Erreur lors de l\'upload du fichier  PDF ' + this.pdfFilesToSend[0].get('file').toString());
        }
      );
    }
  }

  /**
   * Create (POST) a new table
   */
  postTable() {
    const prePostedTable = _.cloneDeep(this.tableService.getCurrentTable());
    const prePostedTableIdentifications: Array<IdentificationModel> = [];

    // Check user is binded to table and syes (it should !)
    if (this.currentVlUser == null) {
      this.notificationService.error('Une erreur est survenue : nous ne parvenons pas à vous identifier correctement');
      return;
    }
    if (prePostedTable.owner == null) {
      prePostedTable.owner = this.currentVlUser;
      if (prePostedTable.syntheticColumn && prePostedTable.syntheticColumn.owner == null) { prePostedTable.syntheticColumn.owner = this.currentVlUser; }
      for (const sye of prePostedTable.sye) {
        if (sye.owner == null) { sye.owner = this.currentVlUser; }
        if (sye.syntheticColumn && sye.syntheticColumn.owner == null) { sye.syntheticColumn.owner = this.currentVlUser; }
      }
    }

    // Bind metadata
    this.bindMetadataToTable(prePostedTable);

    // diagnosis
    if (this.tableForm.controls.isDiagnosis.value === true) { prePostedTable.isDiagnosis = true; } else { prePostedTable.isDiagnosis = false; }

    // Bind table identification
    const rs = this.relatedSyntaxon.length > 0 ? this.relatedSyntaxon[0] : null;
    if (rs) {
      prePostedTableIdentifications.push(this.getIdentificationModelFromRepositoryItemModel(rs));
    }

    if (prePostedTableIdentifications.length > 0) {
      prePostedTable.identifications = prePostedTableIdentifications;
    }

    if (this.pdfFileIrisToLink.length > 0) {
      prePostedTable.pdf = this.pdfFileIrisToLink[0] as any;
    }

    // POST table
    this.postingOrPutingTable = true;
    this.tableService.postTable(prePostedTable).subscribe(
      postedTable => {
        this.pdfFileIrisToLink = [];
        this.tableService.setCurrentTable(postedTable, true);
        this.tableService.isTableDirty.next(false);
        this.postingOrPutingTable = false;
        this.notificationService.notify('Le tableau a été enregistré');

        // 'Close' action panel
        this.router.navigate(['/phyto/app']);

      }, errorPostedTable => {
        this.postingOrPutingTable = false;
        this.notificationService.error('Nous ne parvenons pas à enregistrer le tableau');
        console.log(errorPostedTable);
      }
    );
  }

  /**
   * Replace (PUT) an existing table
   */
  putTable() {
    const prePatchedTable = _.cloneDeep(this.tableService.getCurrentTable());
    const prePatchedTableIdentifications: Array<IdentificationModel> = [];

    prePatchedTable.updatedAt = new Date();

    // Bind metadata
    this.bindMetadataToTable(prePatchedTable);

    // is diagnosis
    if (this.tableForm.controls.isDiagnosis.value === true) { prePatchedTable.isDiagnosis = true; } else { prePatchedTable.isDiagnosis = false; }

    // Bind table identification
    const rs = this.relatedSyntaxon.length > 0 ? this.relatedSyntaxon[0] : null;
    if (prePatchedTable.identifications.length === 0 && rs) {
      // table has no identification yet
      prePatchedTableIdentifications.push(this.getIdentificationModelFromRepositoryItemModel(rs));
      prePatchedTable.identifications.push(...prePatchedTableIdentifications);
    } else if (prePatchedTable.identifications.length > 0 && rs) {
      // table already has a identification => check table identification and related syntaxon values
      const tableIdentification = prePatchedTable.identifications[0];
      if (tableIdentification.repository === rs.repository && tableIdentification.repositoryIdNomen === rs.idNomen && tableIdentification.repositoryIdTaxo === rs.idTaxo) {
        // do nothing
      } else {
        // replace existing identification
        // we 'move' the old identification id to the new identification so API platform will update the old identification instead of create a new one
        const existingIdentificationId = prePatchedTable.identifications[0].id;
        prePatchedTable.identifications[0] = this.getIdentificationModelFromRepositoryItemModel(rs);
        prePatchedTable.identifications[0].id = existingIdentificationId;
      }
    } else if (prePatchedTable.identifications.length > 0 && !rs) {
      // table has an identification but related syntaxon doesn't exist => delete table identification
      // remove table identification
      prePatchedTable.identifications = [];
    }

    // Bind pdf files
    let deleteLinkedPdfFile = false;
    if (prePatchedTable.pdf && this.pdfFileIrisToLink.length > 0) {
      // replace existing pdf file
      const existingPdfFileId = prePatchedTable.pdf.id;
      prePatchedTable.pdf[0] = this.pdfFileIrisToLink[0];
      prePatchedTable.pdf[0].id = existingPdfFileId;
    } else if (prePatchedTable.pdf && this.currentTablePdfFiles.length === 0) {
      // remove linked pdf files
      deleteLinkedPdfFile = true;
    } else if (prePatchedTable.pdf == null && this.pdfFileIrisToLink.length > 0) {
      // Create a new pdf file linked to the table
      prePatchedTable.pdf = this.pdfFileIrisToLink[0] as any;
    }

    // PUT table
    this.postingOrPutingTable = true;
    this.tableService.putTable(prePatchedTable).subscribe(
      patchedTable => {
        // pdf file to unlink ?
        if (deleteLinkedPdfFile) {
          this.pdfFileService.removePdfFile(patchedTable.pdf.id).subscribe(
            removedPdfFile => {
              patchedTable.pdf = null;
              this.tableService.setCurrentTable(patchedTable, true);
              this.tableService.isTableDirty.next(false);
              this.postingOrPutingTable = false;
              this.notificationService.notify('Le tableau a été enregistré');

              // 'Close' action panel
              this.router.navigate(['/phyto/app']);

            }, errorRemovedPdfFile => {
              console.log(errorRemovedPdfFile);
              this.postingOrPutingTable = false;
              this.notificationService.warn('Nous ne parvenons pas à supprimer le fichier PDF lié au tableau');
              this.tableService.setCurrentTable(patchedTable, true);
            }
          );
        } else {
          this.tableService.setCurrentTable(patchedTable, true);
          this.postingOrPutingTable = false;
          this.notificationService.notify('Le tableau a été enregistré');

          // 'Close' action panel
          this.router.navigate(['/phyto/app']);

        }
      }, errorPatchedTable => {
        console.log(errorPatchedTable);
        this.notificationService.error('Nous ne parvenons pas à enregistrer le tableau');
      }
    );
  }

  saveTable() {
    const ct = this.tableService.getCurrentTable();
    // POST pdf file
    let pdfFilesToPost = false;
    if (this.pdfFilesToSend.length > 0) { pdfFilesToPost = true; }

    const callback = ct.id ? 'PUT' : 'POST';

    if (pdfFilesToPost) {
      this.postPdfFiles(callback);
    } else {
      if (callback === 'POST') {
        this.postTable();
      } else {
        this.putTable();
      }
    }
  }

  private getIdentificationModelFromRepositoryItemModel(rim: RepositoryItemModel): IdentificationModel {
    const name = rim.name + (rim.author && rim.author !== '' ? ' ' + rim.author : '');
    const ovm: IdentificationModel = {
      inputName: name,
      repository: rim.repository,
      repositoryIdNomen: +rim.idNomen,
      repositoryIdTaxo: rim.idTaxo.toString(),
      validName: name,
      validatedName: name,
      validatedAt: new Date(),
      validatedBy: this.currentUser.id,
      owner: this.currentVlUser
    };
    return ovm;
  }

  bindMetadataToTable(table: Table) {
    table.title = this.tableForm.controls.title.value;
    table.description = this.tableForm.controls.description.value;
    table.createdAt = this.tableForm.controls.createdAt.value;
  }

  bindForm(table: Table) {
    this.tableForm.controls.createdAt.setValue(table.createdAt, {emitEvent: false});
    // this.tableForm.controls.createdBy.setValue(table.createdBy, {emitEvent: false});
    this.tableForm.controls.isDiagnosis.setValue(table.isDiagnosis, {emitEvent: false});
    this.tableForm.controls.title.setValue(table.title, {emitEvent: false});
    this.tableForm.controls.description.setValue(table.description, {emitEvent: false});
    this.tableForm.controls.biblioSource.setValue('', {emitEvent: false});
    this.tableForm.controls.isDiagnosis.setValue(table.isDiagnosis, {emitEvent: false});

    if (table.identifications.length > 0) {
      this.relatedSyntaxon = [{
        repository: table.identifications[0].repository,
        idNomen: table.identifications[0].repositoryIdNomen,
        idTaxo: table.identifications[0].repositoryIdTaxo,
        name: table.identifications[0].inputName,
        author: ''
      }];
    } else {
      this.relatedSyntaxon = [];
    }
  }

}
