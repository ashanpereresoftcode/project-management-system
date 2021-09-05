import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SkillAssessmentService } from '../../../shared/services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-assessment',
  templateUrl: './create-assessment.component.html',
  styleUrls: ['./create-assessment.component.scss']
})
export class CreateAssessmentComponent implements OnInit {

  @Input() skill!: any;
  skillFormGroup!: FormGroup;

  constructor(
    public matDialogRef: MatDialogRef<CreateAssessmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastrService: ToastrService,
    private skillAssessmentService: SkillAssessmentService) { }

  ngOnInit(): void {
    this.initializeForm();
    if (this.data) {
      this.skill = this.data.skill;
      this.patchSkillForm();
    }
  }

  initializeForm = () => {
    this.skillFormGroup = new FormGroup({
      skillName: new FormControl(null, Validators.required),
      skillCode: new FormControl(null, Validators.required),
      description: new FormControl(null),
    })
  }

  patchSkillForm = () => {
    this.skillFormGroup.patchValue(this.skill);
  }

  closeModal = () => {
    this.matDialogRef.close();
  }

  saveSkillAssessment = () => {
    Object.keys(this.skillFormGroup.controls).forEach(e => {
      const control = this.skillFormGroup.get(e);
      control?.markAsTouched();
      control?.updateValueAndValidity({ onlySelf: true });
    });

    if (this.skillFormGroup.valid) {
      const skill = this.skillFormGroup.value;

      if (this.skill) {
        this.skill.skillName = skill.skillName;
        this.skill.skillCode = skill.skillCode;
        this.skill.description = skill.description;
        this.skill.rating = skill.rating;
        // add the service call from here
        const skillEditedRef = { isEditMode: true, skill: this.skill };
        this.toastrService.success('Successfully updated.', 'Success');
        this.skillAssessmentService.afterSave.emit(skillEditedRef);
        this.closeModal();
      } else {
        // add the service call from here
        this.toastrService.success('Successfully saved.', 'Success');
        this.skillAssessmentService.afterSave.emit(skill);
        this.closeModal();
      }
    } else {
      this.toastrService.error('Please check the form again.', 'Error');
    }

  }

}
