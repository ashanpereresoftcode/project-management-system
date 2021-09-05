import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-project-assignment',
  templateUrl: './project-assignment.component.html',
  styleUrls: ['./project-assignment.component.scss']
})
export class ProjectAssignmentComponent implements OnInit {

  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions!: Observable<string[]> | undefined;

  projectAssignmentForm!: FormGroup;

  constructor(public matDialogRef: MatDialogRef<ProjectAssignmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {
    this.initializeForm();
    this.filterOptionValueChanges();
  }

  initializeForm = () => {
    this.projectAssignmentForm = new FormGroup({
      selectedProject: new FormControl(null, Validators.required),
      assignedUsers: new FormControl(null, Validators.required)
    })
  }

  filterOptionValueChanges = () => {
    this.filteredOptions = this.projectAssignmentForm.get('selectedProject')?.valueChanges.pipe(startWith(''), map(value => this._filter(value)));
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  closeModal = () => {
    this.matDialogRef.close();
  }

  assignProject = () => {

  }

}
