import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ReservationsPageComponent } from './reservations-page.component';

describe('ReservationsPageComponent', () => {
  let component: ReservationsPageComponent;
  let fixture: ComponentFixture<ReservationsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationsPageComponent, NoopAnimationsModule],
    }).compileComponents();
    
    fixture = TestBed.createComponent(ReservationsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
