import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelComponent } from './channel.component';
import {ActivatedRoute} from "@angular/router";

describe('ChannelComponent', () => {
  let component: ChannelComponent;
  let fixture: ComponentFixture<ChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelComponent],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
