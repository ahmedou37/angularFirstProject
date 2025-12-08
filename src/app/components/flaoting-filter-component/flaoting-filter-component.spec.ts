import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlaotingFilterComponent } from './flaoting-filter-component';

describe('FlaotingFilterComponent', () => {
  let component: FlaotingFilterComponent;
  let fixture: ComponentFixture<FlaotingFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlaotingFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlaotingFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
