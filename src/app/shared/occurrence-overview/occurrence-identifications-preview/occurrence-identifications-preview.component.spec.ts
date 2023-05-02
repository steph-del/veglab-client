import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OccurrenceIdentificationsPreviewComponent } from './occurrence-identifications-preview.component';

describe('OccurrenceIdentificationsPreviewComponent', () => {
  let component: OccurrenceIdentificationsPreviewComponent;
  let fixture: ComponentFixture<OccurrenceIdentificationsPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OccurrenceIdentificationsPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OccurrenceIdentificationsPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
