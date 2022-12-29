import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsChipsComponent } from './tags-chips.component';

describe('TagsChipsComponent', () => {
  let component: TagsChipsComponent;
  let fixture: ComponentFixture<TagsChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagsChipsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagsChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
