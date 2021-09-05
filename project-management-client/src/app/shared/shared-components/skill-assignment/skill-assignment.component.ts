import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-skill-assignment',
  templateUrl: './skill-assignment.component.html',
  styleUrls: ['./skill-assignment.component.scss']
})
export class SkillAssignmentComponent implements OnInit {
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions!: Observable<string[]> | undefined;

  skillAssignmentForm!: FormGroup;
  currentRating: number = 0;

  constructor(public matDialogRef: MatDialogRef<SkillAssignmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {
    this.initializeForm();
    this.filterOptionValueChanges();
  }

  initializeForm = () => {
    this.skillAssignmentForm = new FormGroup({
      selectedSkills: new FormControl(null, Validators.required),
      assignedUser: new FormControl(null, Validators.required),
      rating: new FormControl(null)
    })
  }

  filterOptionValueChanges = () => {
    this.filteredOptions = this.skillAssignmentForm.get('selectedSkills')?.valueChanges.pipe(startWith(''), map(value => this._filter(value)));
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  updatedRating = (event: any) => {
    this.currentRating = event;
    this.skillAssignmentForm.get('rating')?.setValue(this.currentRating);
  }

  closeModal = () => {
    this.matDialogRef.close();
  }

  assignProject = () => {

  }

}
