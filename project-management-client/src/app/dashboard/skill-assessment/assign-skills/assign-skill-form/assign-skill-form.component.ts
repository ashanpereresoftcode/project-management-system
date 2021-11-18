import { Component, OnInit, Inject, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ColDef, GridApi, GridOptions } from "ag-grid-community";
import { Observable, Subscription } from 'rxjs';
import { SkillAssessmentService, AuthService } from '../../../../shared/services';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'assign-skill-form',
  templateUrl: './assign-skill-form.component.html',
  styleUrls: ['./assign-skill-form.component.scss']
})
export class AssignSkillFormComponent implements OnInit, OnDestroy {

  @Input() assignedSkills: any;
  @BlockUI() blockUI!: NgBlockUI;
  @Output() afterSkillAssignment: EventEmitter<boolean> = new EventEmitter<boolean>();

  // closeExpansion!: boolean;
  // filteredSkills: Observable<any[]> | undefined;
  // selectedSkill: any;
  subscriptions: Subscription[] = [];
  skills: any[] = [];
  skillAssignFormGroup!: FormGroup;
  currentRating: number = 0;
  users: any[] = [];
  gridApi!: GridApi;
  gridColumnApi: any;

  columnDefs!: ColDef[];
  defaultColDef!: ColDef;
  rowData: any[] = [];
  gridOption!: GridOptions;
  skillSubscriptions: Subscription[] = [];
  existingAssignedSkill: any;

  constructor(
    private skillAssessmentService: SkillAssessmentService,
    private authService: AuthService,
    private toastrService: ToastrService) {
  }

  ngOnInit(): void {
    this.initializeFormGroup();
    this.fetchSkills();
    this.fetchUsers();
    this.skillUpdateListener();
  }

  initializeFormGroup = () => {
    this.skillAssignFormGroup = new FormGroup({
      resource: new FormControl(null, Validators.required),
      skill: new FormControl(null, Validators.required),
      rating: new FormControl(null),
      comments: new FormControl(null)
    })
  }

  skillUpdateListener = () => {
    this.subscriptions.push(this.skillAssessmentService.emitSkillInformation.subscribe((skillRes: any) => {
      if (skillRes) {
        this.existingAssignedSkill = skillRes;
        const formValues = {
          resource: skillRes?.user?._id,
          skill: skillRes?.skill?._id,
          rating: skillRes?.rating,
          comments: skillRes?.comments,
        }
        this.currentRating = skillRes?.rating;
        this.patchForm(formValues);
      }
    }))
  }

  patchForm = (formValues: any) => {
    this.skillAssignFormGroup.patchValue(formValues);
  }

  fetchUsers = () => {
    this.subscriptions.push(this.authService.fetchUsers().subscribe(userResult => {
      if (userResult) {
        this.users = userResult.result;
      }
    }, error => {
      console.log(error);
    }))
  }

  fetchSkills = () => {
    this.subscriptions.push(this.skillAssessmentService.getAllSkills().subscribe((skills: any) => {
      if (skills && skills.validity) {
        this.skills = skills.result;
        // const assignedSkills = this.selectdUser.assignedSkills.map((x: any) => x.skill);
        // this.skills = skills.result.filter(function (array_el: any) {
        //   return assignedSkills.filter(function (anotherOne_el: any) {
        //     return anotherOne_el.skillId == array_el.skillId;
        //   }).length == 0
        // });
      }
    }, error => {
      console.log(error);
    }))
  }

  // onSkillSelection = () => {
  //   this.selectedSkill = this.skillAssignFormGroup.get('skill')?.value;
  // }

  onGridReady = (params: any) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.sizeToFit();
  }

  sizeToFit = () => {
    this.gridApi.sizeColumnsToFit();
  }

  updatedRating = (event: any) => {
    this.currentRating = event;
    this.skillAssignFormGroup.get('rating')?.setValue(event);
  }

  clearForm = () => {
    this.currentRating = 0;
    this.skillAssignFormGroup.reset({});
  }

  skillAlreadyAssigned = (skillId: any) => {
    return this.assignedSkills.some((x: any) => x.skill._id === skillId);
  }

  onAssign = () => {
    this.blockUI.start('Saving......');
    if (this.skillAssignFormGroup.valid) {
      const assignedSkill = this.skillAssignFormGroup.value;
      if (this.skillAlreadyAssigned(assignedSkill.skill._id)) {
        this.blockUI.stop();
        this.toastrService.error('Skill already assigned.', 'Error');
      } else {
        if (this.existingAssignedSkill) {

          this.existingAssignedSkill.skill = assignedSkill?.skill;
          this.existingAssignedSkill.user = assignedSkill?.resource;
          this.existingAssignedSkill.rating = assignedSkill?.rating;
          this.existingAssignedSkill.ratingCard = assignedSkill?.ratingCard;
          this.existingAssignedSkill.comments = assignedSkill?.comments;

          this.skillAssessmentService.updateAssignedSkill(this.existingAssignedSkill).subscribe(savedResult => {
            if (savedResult) {
              this.toastrService.success('Successfully updated.', 'Success');
              this.clearForm();
              this.afterSkillAssignment.emit(savedResult);
            }
            this.blockUI.stop();
          }, () => {
            this.blockUI.stop();
          });
        } else {
          const payload = {
            skill: assignedSkill?.skill,
            user: assignedSkill?.resource,
            rating: assignedSkill?.rating,
            ratingCard: assignedSkill?.ratingCard,
            comments: assignedSkill?.comments,
          }
          this.skillAssessmentService.saveAssignedSkill(payload).subscribe(savedResult => {
            if (savedResult) {
              this.toastrService.success('Successfully saved.', 'Success');
              this.clearForm();
              this.afterSkillAssignment.emit(savedResult);
            }
            this.blockUI.stop();
          }, () => {
            this.blockUI.stop();
          });
        }
      }
    } else {
      this.blockUI.stop();
      console.log(this.skillAssignFormGroup.errors);
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptions && this.subscriptions.length > 0) {
      this.subscriptions.forEach(s => {
        s.unsubscribe();
      })
    }
  }
}
