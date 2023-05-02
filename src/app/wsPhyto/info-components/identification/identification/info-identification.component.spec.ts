import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoIdentificationComponent } from './info-identification.component';

describe('InfoIdentificationComponent', () => {
  let component: InfoIdentificationComponent;
  let fixture: ComponentFixture<InfoIdentificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoIdentificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoIdentificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
