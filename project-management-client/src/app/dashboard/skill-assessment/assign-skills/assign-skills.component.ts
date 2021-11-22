import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ColDef, GridApi, GridOptions } from "ag-grid-community";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Observable, Subscription } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { AuthService, SkillAssessmentService, LoggedUserService } from '../../../shared/services';
import { AssignSkillCellRendererComponent } from './cell-renderers/assign-skill-cell-renderer/assign-skill-cell-renderer.component';
import { AssignSkillActionCellRendererComponent } from './cell-renderers/assign-skill-action-cell-renderer/assign-skill-action-cell-renderer.component';
import { AssignedSkillCardCellRendererComponent } from './cell-renderers/assigned-skill-card-cell-renderer/assigned-skill-card-cell-renderer.component';
import { AssignedSkillReportComponent } from './assigned-skill-report/assigned-skill-report.comopnent';
import { AssignSkillDialogComponent } from './assign-skill-dialog/assign-skill-dialog.component';
import { UserNameCellRendererComponent } from './cell-renderers/user-name-cell-renderer/user-name-cell-renderer.component';
import { UserDesignationCellRendererComponent } from './cell-renderers/user-designation-cell-renderer/user-designation-cell-renderer.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-assign-skills',
  templateUrl: './assign-skills.component.html',
  styleUrls: ['./assign-skills.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AssignSkillsComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @BlockUI() blockUI!: NgBlockUI;
  displayedColumns: string[] = ['index', 'empty', 'name', 'user-email', 'designation', 'action'];
  dataSource = new MatTableDataSource<any>();

  skillColumns: string[] = ['skill', 'rate-point', 'rate-card', 'comments', 'action'];

  skills: any[] = [];
  users: any[] = [];
  currentRating: number = 0;
  skillAssignFormGroup!: FormGroup;
  isUpdate: boolean = false;
  existingPayload: any;

  constructor(
    private skillAssessmentService: SkillAssessmentService,
    private authService: AuthService, public matDialog: MatDialog,
    private toastrService: ToastrService) {
  }

  ngOnInit(): void {
    this.initializeFormGroup();
    this.fetchSkills();
    this.fetchUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  initializeFormGroup = () => {
    this.skillAssignFormGroup = new FormGroup({
      resource: new FormControl(null, Validators.required),
      skill: new FormControl(null, Validators.required),
      rating: new FormControl(null),
      comments: new FormControl(null)
    })
  }

  fetchUsers = () => {
    this.blockUI.start('Processing.....');
    this.authService.fetchUsers().subscribe(serviceRes => {
      if (serviceRes && serviceRes.result) {
        this.users = serviceRes?.result;
        serviceRes.result.forEach((u: any, index: number) => {
          u['index'] = index ? index + 1 : 1;
          u['expanded'] = false;
        })
        this.blockUI.stop();
        this.dataSource.data = serviceRes.result.filter((x: any) => x.assignedSkills.length > 0);
      }
    }, () => {
      this.blockUI.stop();
    })
  }

  fetchSkills = () => {
    this.skillAssessmentService.getAllSkills().subscribe((skills: any) => {
      if (skills && skills.validity) {
        this.skills = skills.result;
      }
    }, error => {
      console.log(error);
    })
  }

  subGroupsAvailable = (index: any, item: any): boolean => {
    return item?.assignedSkills?.length > 0;
  }

  getRatingCard = (rate: number): string => {
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

  skillAlreadyAssigned = (skillRef: any) => {
    const user = this.users.find(x => x._id === skillRef?.resource);
    if (user && user?.assignedSkills?.length > 0) {
      const t = user.assignedSkills.some((x: any) => x.skill._id === skillRef?.skill);
      return t;
    }
    return false;
  }

  onAssign = () => {
    this.blockUI.start('');
    if (this.skillAssignFormGroup.valid) {
      const assignedSkill = this.skillAssignFormGroup.value;

      if (this.skillAlreadyAssigned(assignedSkill) && !this.isUpdate) {
        this.toastrService.error('Selected skill is already being assigned.', 'Error');
        this.blockUI.stop();
      } else {
        if (this.isUpdate) {
          const tempPayload: any = JSON.parse(JSON.stringify(this.existingPayload));
          tempPayload.skill = assignedSkill.skill;
          tempPayload.user = assignedSkill.resource;
          tempPayload.rating = assignedSkill.rating;
          tempPayload.ratingCard = this.getRatingCard(+assignedSkill?.rating);
          tempPayload.comments = assignedSkill.comments;

          this.skillAssessmentService.updateAssignedSkill(tempPayload).subscribe(updatedResult => {
            if (updatedResult) {
              this.existingPayload = {};
              this.clearFields();
              this.isUpdate = false;
              this.toastrService.success('Successfully Updated.', 'Success');
              this.fetchUsers();
            }
            this.blockUI.stop();
          }, (e) => {
            console.log(e);
            this.blockUI.stop();
          })

        } else {
          const assignedSkillPayload = {
            skill: assignedSkill.skill,
            user: assignedSkill.resource,
            rating: assignedSkill.rating,
            ratingCard: this.getRatingCard(+assignedSkill?.rating),
            comments: assignedSkill.comments,
          }

          this.skillAssessmentService.saveAssignedSkill(assignedSkillPayload).subscribe(savedResult => {
            if (savedResult) {
              savedResult['assignedSkill'] = this.skillAssignFormGroup.value;
              this.clearFields();
              this.toastrService.success('Successfully Saved.', 'Success');
              this.fetchUsers();
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

  onResourceChange = () => {
    if (this.isUpdate) {
      this.existingPayload = {};
      this.isUpdate = false;
    }
  }

  clearFields = () => {
    this.skillAssignFormGroup.reset({});
    this.currentRating = 0;
  }

  editAssignedSkill = (assignedSkill: any) => {
    this.existingPayload = assignedSkill;

    const patchedValue = {
      resource: assignedSkill?.user,
      skill: assignedSkill?.skill?._id,
      rating: assignedSkill?.rating,
      comments: assignedSkill?.comments,
    }
    this.currentRating = assignedSkill?.rating;
    this.skillAssignFormGroup.patchValue(patchedValue);
    this.isUpdate = true;
  }

  deleteAssignedTask = (assignedSkill: any) => {
    this.blockUI.start('Deleting....');
    const appIds: string[] = [].concat(assignedSkill?._id);
    if (appIds && appIds.length > 0) {
      this.proceedDelete(assignedSkill?.user, appIds);
    } else {
      this.toastrService.error("Please select items to delete.", "Error");
      this.blockUI.stop();
    }
  }

  proceedDelete = (userId: any, appIds: string[]) => {
    let form = new FormData();
    form.append("assignedSkillIds", JSON.stringify(appIds));
    form.append("userId", JSON.stringify(userId));

    this.skillAssessmentService.deleteAssignedSkill(form).subscribe((deletedResult: any) => {
      if (deletedResult) {
        this.toastrService.success('Successfully deleted.', 'Success');
        this.fetchUsers();
      }
      this.blockUI.stop();
    }, () => {
      this.toastrService.error('Failed to delete', 'Error');
      this.blockUI.stop();
    });
  }

  updatedRating = (event: any) => {
    this.currentRating = event;
    this.skillAssignFormGroup.get('rating')?.setValue(event);
  }

  openSkillAssignmentReport = (selectedUser: any) => {
    this.matDialog.open(AssignedSkillReportComponent, {
      width: '70%',
      height: 'auto',
      data: { user: selectedUser }
    });
  }

  ngOnDestroy() {
  }
}
