import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotAuthorisedOverlayComponent } from './not-authorised-overlay.component';

describe('NotAuthorisedOverlayComponent', () => {
  let component: NotAuthorisedOverlayComponent;
  let fixture: ComponentFixture<NotAuthorisedOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotAuthorisedOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotAuthorisedOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
