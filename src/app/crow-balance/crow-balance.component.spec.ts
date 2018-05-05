import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrowBalanceComponent } from './crow-balance.component';

describe('CrowBalanceComponent', () => {
  let component: CrowBalanceComponent;
  let fixture: ComponentFixture<CrowBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrowBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrowBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
