import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {MatChipInputEvent} from '@angular/material/chips';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tags-chips',
  templateUrl: './tags-chips.component.html',
  styleUrls: ['./tags-chips.component.css']
})
export class TagsChipsComponent implements OnInit {

  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl('');
  filteredtags: Observable<string[]>;
  tags: string[] = [];

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @Output() newItemEvent = new EventEmitter<string[]>();

  ngOnInit(): void {
  }

  constructor() {
  }

  tagsEmitter(value: string[]) {
    this.newItemEvent.emit(value);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our tag
    if (value) {
      if (this.tags.length > 9) {
        alert("You can't add more than 10 tags");
      } else {
        this.tags.push(value);
      }
    }
    this.tagsEmitter(this.tags);
    // Clear the input value
    event.chipInput!.clear();

    this.tagCtrl.setValue(null);
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }
}
