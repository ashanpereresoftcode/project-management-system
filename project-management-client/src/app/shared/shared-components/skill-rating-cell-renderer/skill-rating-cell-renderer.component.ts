import { Component, OnInit, OnDestroy } from '@angular/core';
import { ICellRendererParams } from "ag-grid-community";
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { AuthService, SkillAssessmentService } from '../../services';

@Component({
  selector: 'app-skill-rating-cell-renderer',
  templateUrl: './skill-rating-cell-renderer.component.html',
  styleUrls: ['./skill-rating-cell-renderer.component.scss']
})
export class SkillRatingCellRendererComponent implements OnInit {

  data: any;
  currentRating: number = 0;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private toastrService: ToastrService,
    private skillAssessmentService: SkillAssessmentService) {
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


  ngOnDestroy() {
    
  }
}
