import { Component, OnInit, Inject, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColDef, GridApi, GridOptions } from "ag-grid-community";
import { Observable, Subscription } from 'rxjs';
import { SkillAssessmentService, AuthService } from '../../../../shared/services';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-assign-skill-dialog',
  templateUrl: './assign-skill-dialog.component.html',
  styleUrls: ['./assign-skill-dialog.component.scss']
})
export class AssignSkillDialogComponent implements OnInit {

  @Input() selectdUser: any;
  @BlockUI() blockUI!: NgBlockUI;
  @Output() afterSkillAssignment: EventEmitter<boolean> = new EventEmitter<boolean>();

  closeExpansion!: boolean;
  filteredSkills: Observable<any[]> | undefined;
  selectedSkill: any;
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

  panelOpenState = false;

  constructor(
    public matDialogRef: MatDialogRef<AssignSkillDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private skillAssessmentService: SkillAssessmentService,
    private authService: AuthService) {
    matDialogRef.disableClose = false;
  }

  ngOnInit(): void {
    if (this.data) {
      this.selectdUser = this.data.user;
    }
    this.matDialogRef.disableClose = true;
    this.initializeFormGroup();
    this.fetchSkills();
    this.fetchUsers();
  }

  initializeFormGroup = () => {
    this.skillAssignFormGroup = new FormGroup({
      // resource: new FormControl(null, Validators.required),
      skill: new FormControl(null, Validators.required),
      rating: new FormControl(null),
      comments: new FormControl(null)
    })
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
        console.log(skills);
        const assignedSkills = this.selectdUser.assignedSkills.map((x: any) => x.skill);
        this.skills = skills.result.filter(function (array_el: any) {
          return assignedSkills.filter(function (anotherOne_el: any) {
            return anotherOne_el.skillId == array_el.skillId;
          }).length == 0
        });
      }
    }, error => {
      console.log(error);
    }))
  }

  onSkillSelection = () => {
    this.selectedSkill = this.skillAssignFormGroup.get('skill')?.value;
  }

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

  closeModal = () => {
    this.matDialogRef.close();
  }

  onAssign = () => {
    this.blockUI.start('Saving......');
    if (this.skillAssignFormGroup.valid) {
      const assignedSkill = this.skillAssignFormGroup.value;
      assignedSkill['user'] = this.selectdUser._id;

      this.skillAssessmentService.saveAssignedSkill(assignedSkill).subscribe(savedResult => {
        if (savedResult) {
          savedResult['assignedSkill'] = this.skillAssignFormGroup.value;
          this.afterSkillAssignment.emit(savedResult);
          this.closeModal();
        }
        this.blockUI.stop();
      }, error => {
        this.blockUI.stop();
      });
    } else {
      this.blockUI.stop();
      console.log(this.skillAssignFormGroup.errors);
    }
  }
}
