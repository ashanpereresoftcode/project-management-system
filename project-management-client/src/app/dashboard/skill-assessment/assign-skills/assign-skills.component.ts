import { Component, OnInit, OnDestroy } from '@angular/core';
import { ColDef, GridApi, GridOptions } from "ag-grid-community";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { AuthService, SkillAssessmentService, LoggedUserService } from '../../../shared/services';
import { AssignSkillCellRendererComponent } from './cell-renderers/assign-skill-cell-renderer/assign-skill-cell-renderer.component';
import { AssignSkillActionCellRendererComponent } from './cell-renderers/assign-skill-action-cell-renderer/assign-skill-action-cell-renderer.component';
import { AssignedSkillCardCellRendererComponent } from './cell-renderers/assigned-skill-card-cell-renderer/assigned-skill-card-cell-renderer.component';
// import { SkillAssignmentComponent } from '../../../shared/shared-components';
import { AssignedSkillReportComponent } from './assigned-skill-report/assigned-skill-report.comopnent';
import { AssignSkillDialogComponent } from './assign-skill-dialog/assign-skill-dialog.component';
import { UserNameCellRendererComponent } from './cell-renderers/user-name-cell-renderer/user-name-cell-renderer.component';
import { UserDesignationCellRendererComponent } from './cell-renderers/user-designation-cell-renderer/user-designation-cell-renderer.component';

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
    public matDialog: MatDialog
  ) {
    this.columnDefs = [
      {
        headerName: 'Name',
        width: 90,
        cellRendererFramework: UserNameCellRendererComponent
      },
      {
        headerName: 'Designation',
        width: 90,
        cellRendererFramework: UserDesignationCellRendererComponent
      },
      {
        headerName: 'Skill',
        suppressAutoSize: true,
        width: 90,
        cellRendererFramework: AssignSkillCellRendererComponent
      },
      {
        headerName: 'Rating',
        suppressAutoSize: true,
        width: 90,
        cellRendererFramework: AssignedSkillCardCellRendererComponent
      },
      {
        field: 'description',
        headerName: 'Description',
        suppressAutoSize: true,
        width: 90
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
    // this.loadUsers();
    this.assignedSkillDeletion();
    this.fetchAssignedSkills();
  }

  afterSkillAssigned = (eventData: any) => {
    this.fetchAssignedSkills();
  }

  fetchAssignedSkills = () => {
    this.skillAssessmentService.getAllAssignedSkills().subscribe(serviceResult => {
      if (serviceResult && serviceResult.validity) {
        this.rowData = serviceResult.result;
        this.gridApi.setRowData(this.rowData);
      }
    })
  }

  assignedSkillDeletion = () => {
    this.subscriptions.push(this.skillAssessmentService.afterAssignmentDeletion.subscribe(res => {
      if (res) {
        // const assignedSkills = this.selectedUser.assignedSkills.filter((s: any) => s?._id !== res?.deletedId[0]);
        // this.selectedUser.assignedSkills = [...assignedSkills];
        // this.rowData = this.selectedUser.assignedSkills;
        // this.gridApi.setRowData(this.rowData);
        this.fetchAssignedSkills();
      }
    }))
  }

  // loadAssignedSkills = () => {
  //   const userId = this.loggedUserService.getLoggedUserId();
  //   this.subscriptions.push(this.skillAssessmentService.getAssignedSkills(userId).subscribe((skillServiceResult: any) => {
  //     if (skillServiceResult) {

  //     }
  //   }, error => {
  //     console.log(error);
  //   }));
  // }

  // loadUsers = () => {
  //   this.subscriptions.push(this.authService.fetchUsers().subscribe(userResult => {
  //     if (userResult) {
  //       // this.users = userResult.result.filter((x: any) => x?.assignedProjects?.length > 0);
  //       this.users = userResult.result;
  //       // this.resourceControllerListener();
  //     }
  //   }, error => {
  //     console.log(error);
  //   }))
  // }

  // resourceControllerListener = () => {
  //   this.filteredUsers = this.skillAssignFormGroup.get('resource')?.valueChanges.pipe(
  //     startWith(''),
  //     map(v => this.filterUsers(v))
  //   )
  // }

  sizeToFit = () => {
    this.gridApi.sizeColumnsToFit();
  }

  onGridReady = (params: any) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.sizeToFit();
  }

  clearFields = () => {
    this.selectedSkill = null;
    this.selectedUser = null;
  }

  // onResourceSelection = () => {
  // this.rowData = this.selectedUser.assignedSkills;
  // }

  // getRatingCard = (): string => {
  //   const rate: number = +this.skillAssignFormGroup.get('rating')?.value;
  //   let ratingCard: string = "";
  //   switch (rate) {
  //     case 0:
  //       ratingCard = "N/A";
  //       break;
  //     case 1:
  //       ratingCard = "Fundamental Awareness (basic knowledge)";
  //       break;
  //     case 2:
  //       ratingCard = "Novice (limited experience)";
  //       break;
  //     case 3:
  //       ratingCard = "Intermediate (practical application)";
  //       break;
  //     case 4:
  //       ratingCard = "Advanced (applied theory)";
  //       break;
  //     case 5:
  //       ratingCard = "Expert (recognized authority)";
  //       break;
  //   }
  //   return ratingCard;
  // }

  private filterUsers(value: string): any[] {
    const filterValue = value?.toLowerCase();
    if (filterValue) {
      return this.users.filter(u => u.firstName.toLowerCase().includes(filterValue));
    } else {
      return this.users;
    }
  }

  openSkillAssignment = () => {
    const skillAssignmentRef = this.matDialog.open(AssignSkillDialogComponent, {
      width: '60%',
      height: 'auto',
      data: { user: this.selectedUser }
    });

    // skillAssignmentRef.componentInstance.afterSkillAssignment.subscribe((res: any) => {
    //   if (res) {
    //     const assignmentDetail = res?.result?.assignmentDetail;
    //     assignmentDetail.skill = res?.assignedSkill?.skill;
    //     this.rowData.push(assignmentDetail);
    //     this.gridApi.setRowData(this.rowData);
    //     console.log(res);
    //   }
    // })
  }

  openSkillAssignmentReport = () => {
    this.matDialog.open(AssignedSkillReportComponent, {
      width: '70%',
      height: 'auto',
      data: { user: this.selectedUser }
    });
  }

  ngOnDestroy() {
    if (this.subscriptions && this.subscriptions.length) {
      this.subscriptions.forEach(e => { e.unsubscribe(); });
    }
  }
}
