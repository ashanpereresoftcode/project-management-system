import { Component, OnInit, OnDestroy } from '@angular/core';
import { ColDef, GridApi, GridOptions } from "ag-grid-community";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { AuthService, SkillAssessmentService, LoggedUserService } from '../../../shared/services';
import { AssignSkillCellRendererComponent } from '../assign-skill-cell-renderer/assign-skill-cell-renderer.component';
import { AssignSkillActionCellRendererComponent } from '../assign-skill-action-cell-renderer/assign-skill-action-cell-renderer.component';
import { AssignedSkillCardCellRendererComponent } from '../assigned-skill-card-cell-renderer/assigned-skill-card-cell-renderer.component';
import { SkillAssignmentComponent } from '../../../shared/shared-components';

@Component({
  selector: 'app-assign-skills',
  templateUrl: './assign-skills.component.html',
  styleUrls: ['./assign-skills.component.scss']
})
export class AssignSkillsComponent implements OnInit, OnDestroy {

  @BlockUI() blockUI!: NgBlockUI;

  // auto filter
  filteredUsers: Observable<any[]> | undefined;
  filteredSkills: Observable<any[]> | undefined;

  selectedUser: any;
  selectedSkill: any;

  //

  skillAssignFormGroup!: FormGroup;
  currentRating: number = 0;
  subscriptions: Subscription[] = [];
  users: any[] = [];
  skills: any[] = [];

  gridApi!: GridApi;
  gridColumnApi: any;

  columnDefs!: ColDef[];
  defaultColDef!: ColDef;
  rowData: any[] = [];
  gridOption!: GridOptions;
  skillSubscriptions: Subscription[] = [];

  // assigned skill.
  assignedSkill!: any;

  constructor(
    private authService: AuthService,
    private skillAssessmentService: SkillAssessmentService,
    private loggedUserService: LoggedUserService,
    private toastrService: ToastrService,
    public matDialog: MatDialog
  ) {
    this.columnDefs = [
      {
        headerName: 'Skill',
        suppressAutoSize: true,
        width: 120,
        cellRendererFramework: AssignSkillCellRendererComponent
      },
      {
        field: 'rating',
        headerName: 'Rating',
        suppressAutoSize: true,
        editable: true,
        onCellValueChanged: (e) => {
          console.log(e);
          debugger
          let ratingCard: string = "";
          switch (+e.newValue) {
            case 0:
              ratingCard = "N/A";
              break;
            case 1:
              ratingCard = "Fundamental Awareness (basic knowledge)";
              break;
            case 2:
              ratingCard = "Novice (limited experience)";
              break;
            case 3:
              ratingCard = "Intermediate (practical application)";
              break;
            case 4:
              ratingCard = "Advanced (applied theory)";
              break;
            case 5:
              ratingCard = "Expert (recognized authority)";
              break;
          }

          const index = this.rowData.findIndex(x => x._id === e.data._id);
          this.rowData[index].ratingCard = ratingCard;
        },
        width: 150
      },
      {
        // field: 'ratingCard',
        headerName: 'Rating Card',
        suppressAutoSize: true,
        width: 150,
        cellRendererFramework: AssignedSkillCardCellRendererComponent
      },
      {
        field: 'description',
        headerName: 'Description',
        width: 120,
        suppressAutoSize: true,
      },
      {
        headerName: 'Actions',
        width: 100,
        cellRendererFramework: AssignSkillActionCellRendererComponent
      }
    ];
    this.defaultColDef = { resizable: true };
  }

  ngOnInit(): void {
    this.loadUsers();
    this.initializeForm();
    this.assignedSkillDeletion();
  }

  assignedSkillDeletion = () => {
    this.subscriptions.push(this.skillAssessmentService.afterAssignmentDeletion.subscribe(res => {
      if (res) {
        const assignedSkills = this.selectedUser.assignedSkills.filter((s: any) => s?._id !== res?.deletedId[0]);
        this.selectedUser.assignedSkills = [...assignedSkills];
        this.rowData = this.selectedUser.assignedSkills;
        this.gridApi.setRowData(this.rowData);
      }
    }))
  }

  loadAssignedSkills = () => {
    const userId = this.loggedUserService.getLoggedUserId();
    this.subscriptions.push(this.skillAssessmentService.getAssignedSkills(userId).subscribe((skillServiceResult: any) => {
      if (skillServiceResult) {

      }
    }, error => {
      console.log(error);
    }));
  }

  loadUsers = () => {
    this.subscriptions.push(this.authService.fetchUsers().subscribe(userResult => {
      if (userResult) {
        this.users = userResult.result;
        this.resourceControllerListener();
      }
    }, error => {
      console.log(error);
    }))
  }

  initializeForm = () => {
    this.skillAssignFormGroup = new FormGroup({
      resource: new FormControl(null, Validators.required),

      // selectedSkill: new FormControl(null),
      // skillRate: new FormControl(null),
      // skillCard: new FormControl(null)
    });
  }

  resourceControllerListener = () => {
    this.filteredUsers = this.skillAssignFormGroup.get('resource')?.valueChanges.pipe(
      startWith(''),
      map(v => this.filterUsers(v))
    )
  }

  sizeToFit = () => {
    this.gridApi.sizeColumnsToFit();
  }

  onGridReady = (params: any) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.sizeToFit();
  }

  // saveSkillAssignment = () => {
  //   // open the skill selection and rating screen
  //   this.blockUI.start('Processing ......');
  //   Object.keys(this.skillAssignFormGroup.controls).forEach(e => {
  //     const control = this.skillAssignFormGroup.get(e);
  //     control?.markAsTouched();
  //     control?.updateValueAndValidity({ onlySelf: true });
  //   });

  //   const isAlreadyAssigned = this.selectedUser.assignedSkills.some((s: any) => s.skill._id === this.selectedSkill._id);
  //   if (isAlreadyAssigned) {
  //     this.toastrService.error('Skill is already assigned.', 'Error');
  //     this.blockUI.stop();
  //   } else {

  //     if (this.skillAssignFormGroup.valid) {
  //       const formValues = this.skillAssignFormGroup.getRawValue();

  //       const payload = {
  //         skill: this.selectedSkill._id,
  //         rating: formValues.rating,
  //         ratingCard: this.getRatingCard(),
  //         comments: "-",
  //         userId: this.selectedUser.userId
  //       }
  //       this.subscriptions.push(this.skillAssessmentService.saveAssignedSkill(payload).subscribe(serviceResult => {
  //         if (serviceResult) {
  //           let assignmentDetail = serviceResult.result.assignmentDetail;
  //           assignmentDetail.skill = this.selectedSkill;
  //           this.rowData.push(assignmentDetail);
  //           this.gridApi.setRowData(this.rowData);
  //           this.toastrService.success('Successfull saved.', 'Success');
  //           this.clearFields();
  //         }
  //         this.blockUI.stop();
  //       }, error => {
  //         console.log(error);
  //         this.blockUI.stop();
  //       }))
  //     }
  //   }
  // }

  clearFields = () => {
    this.selectedSkill = null;
    this.selectedUser = null;
  }

  onResourceSelection = () => {
    this.selectedUser = this.skillAssignFormGroup.get('resource')?.value;
    this.rowData = this.selectedUser.assignedSkills;
  }

  getRatingCard = (): string => {
    const rate: number = +this.skillAssignFormGroup.get('rating')?.value;
    let ratingCard: string = "";
    switch (rate) {
      case 0:
        ratingCard = "N/A";
        break;
      case 1:
        ratingCard = "Fundamental Awareness (basic knowledge)";
        break;
      case 2:
        ratingCard = "Novice (limited experience)";
        break;
      case 3:
        ratingCard = "Intermediate (practical application)";
        break;
      case 4:
        ratingCard = "Advanced (applied theory)";
        break;
      case 5:
        ratingCard = "Expert (recognized authority)";
        break;
    }
    return ratingCard;
  }

  private filterUsers(value: string): any[] {
    const filterValue = value?.toLowerCase();
    if (filterValue) {
      return this.users.filter(u => u.firstName.toLowerCase().includes(filterValue));
    } else {
      return this.users;
    }
  }

  openSkillAssignment = () => {
    const skillAssignmentRef = this.matDialog.open(SkillAssignmentComponent, {
      width: '60%',
      height: 'auto',
      data: { user: this.selectedUser }
    });

    skillAssignmentRef.componentInstance.afterSkillAssignment.subscribe((res: any) => {
      if (res) {
        const assignmentDetail = res?.result?.assignmentDetail;
        assignmentDetail.skill = res?.assignedSkill?.skill;
        this.rowData.push(assignmentDetail);
        this.gridApi.setRowData(this.rowData);
        console.log(res);
      }
    })
  }

  ngOnDestroy() {
    if (this.subscriptions && this.subscriptions.length) {
      this.subscriptions.forEach(e => { e.unsubscribe(); });
    }
  }
}
