import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnpairingComponent } from './unpairing.component';

describe('UnpairingComponent', () => {
  let component: UnpairingComponent;
  let fixture: ComponentFixture<UnpairingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnpairingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnpairingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
