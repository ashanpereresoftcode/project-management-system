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

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

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

  constructor(
    private skillAssessmentService: SkillAssessmentService,
    private authService: AuthService, public matDialog: MatDialog,
    private toastrService: ToastrService) {
  }

  ngOnInit(): void {
    this.fetchAssignedSkills();
    this.fetchUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  fetchUsers = () => {
    this.authService.fetchUsers().subscribe(serviceRes => {
      if (serviceRes && serviceRes.result) {
        serviceRes.result.forEach((u: any, index: number) => {
          u['index'] = index ? index : 1;
          u['expanded'] = false;
        })
        this.dataSource.data = serviceRes.result.filter((x: any) => x.assignedSkills.length > 0);
      }
    })
  }

  fetchAssignedSkills = () => {
    this.skillAssessmentService.getAllAssignedSkills().subscribe(serveiceRes => {
      if (serveiceRes) {

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

  editAssignedSkill = (assignedSkill: any) => {
    // edit implementation
  }

  deleteAssignedTask = (assignedSkill: any) => {
    this.blockUI.start('Deleting....');
    const appIds: string[] = [].concat(assignedSkill?._id);
    if (appIds && appIds.length > 0) {
      this.proceedDelete(assignedSkill, appIds);
    } else {
      this.toastrService.error("Please select items to delete.", "Error");
      this.blockUI.stop();
    }
  }

  proceedDelete = (assignedSkill: any, appIds: string[]) => {
    let form = new FormData();
    debugger
    form.append("assignedSkillIds", JSON.stringify(appIds));
    form.append("user", JSON.stringify(assignedSkill?.user?.userId));

    // this.skillAssessmentService.deleteAssignedSkill(form).subscribe((deletedResult: any) => {
    //   if (deletedResult) {
    //     this.toastrService.success('Successfully deleted.', 'Success');
    //     this.skillAssessmentService.afterAssignmentDeletion.emit({ deleted: true, deletedId: appIds });
    //   }
    //   this.blockUI.stop();
    // }, () => {
    //   this.toastrService.error('Failed to delete', 'Error');
    //   this.blockUI.stop();
    // });
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
