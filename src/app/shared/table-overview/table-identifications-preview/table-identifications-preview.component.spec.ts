import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableIdentificationsPreviewComponent } from './table-identifications-preview.component';

describe('TableIdentificationsPreviewComponent', () => {
  let component: TableIdentificationsPreviewComponent;
  let fixture: ComponentFixture<TableIdentificationsPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableIdentificationsPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableIdentificationsPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
