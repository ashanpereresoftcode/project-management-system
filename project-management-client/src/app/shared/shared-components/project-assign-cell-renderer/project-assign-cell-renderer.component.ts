import { Component, OnInit, OnDestroy } from '@angular/core';
import { ICellRendererParams } from "ag-grid-community";
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { AuthService, ProjectManagementService } from '../../services';

@Component({
  selector: 'app-project-assign-cell-renderer',
  templateUrl: './project-assign-cell-renderer.component.html',
  styleUrls: ['./project-assign-cell-renderer.component.scss']
})
export class ProjectAssignCellRendererComponent implements OnInit {

  data: any;
  @BlockUI() blockUI!: NgBlockUI;

  projSubscription: Subscription[] = [];

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private toastrService: ToastrService,
    private projectManagementService: ProjectManagementService) {
  }

  ngOnInit(): void {
  }

  agInit(params: ICellRendererParams): void {
    if (params && params.data) {
      this.data = params.data;
    }
  }

  refresh(params: ICellRendererParams) {
    this.data = this.getValueToDisplay(params);
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.value;
  }

  assign = () => {
    const projectInfo = this.projectManagementService.projectInformation;
    let user = this.data;

    let assignedProj = {
      projectId: 1,
      projectName: projectInfo.projectName,
      projectCode: projectInfo.projectCode,
    }

    let projects = user.projects ? JSON.parse(user.projects) : [{ ...assignedProj }];

    if (projects && projects > 0) {
      projects.push(assignedProj);
    }
    user['projects'] = JSON.stringify(projects)

    this.authService.updateUser(user).subscribe(result => {
      if (result) {
        this.toastrService.success('Updated successfully', 'Success');
      }
    }, error => {
      console.log(error);
    })
    // do service call.
  }

  ngOnDestroy() {
    if (this.projSubscription && this.projSubscription.length > 0) {
      this.projSubscription.forEach(s => {
        s.unsubscribe();
      })
    }
  }
}
