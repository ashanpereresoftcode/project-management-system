import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColDef, GridApi, GridOptions } from "ag-grid-community";
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AssignSkillCellRendererComponent } from '../cell-renderers/assign-skill-cell-renderer/assign-skill-cell-renderer.component';
import { AssignedSkillCardCellRendererComponent } from '../cell-renderers/assigned-skill-card-cell-renderer/assigned-skill-card-cell-renderer.component';
import { FileService } from '../../../../shared/services/file.service';
import * as moment from 'moment';

@Component({
  selector: 'app-skill-report',
  templateUrl: './assigned-skill-report.comopnent.html',
  styleUrls: ['./assigned-skill-report.comopnent.scss']
})
export class AssignedSkillReportComponent implements OnInit {

  @BlockUI() blockUI!: NgBlockUI;

  gridApi!: GridApi;
  gridColumnApi: any;

  columnDefs!: ColDef[];
  defaultColDef!: ColDef;
  rowData: any[] = [];
  gridOption!: GridOptions;
  user: any;

  constructor(
    public matDialogRef: MatDialogRef<AssignedSkillReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fileService: FileService
  ) {
    this.columnDefs = [
      {
        headerName: 'Skill',
        cellRendererFramework: AssignSkillCellRendererComponent,
      },
      {
        field: 'rating',
        headerName: 'Rating',
      },
      {
        headerName: 'Rating Card',
        suppressAutoSize: true,
        cellRendererFramework: AssignedSkillCardCellRendererComponent
      },
      {
        field: 'comments',
        headerName: 'Comments',
        suppressAutoSize: true,
      }
    ];
  }

  ngOnInit(): void {
    if (this.data) {
      this.user = this.data?.user;
      this.rowData = this.data?.user?.assignedSkills;
    }
  }

  onGridReady = (params: any) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.sizeToFit();
  }

  sizeToFit = () => {
    this.gridApi.sizeColumnsToFit();
  }

  generatePdf = () => {
    // this.blockUI.start('Exporting Pdf...');
    const pdfData: any[] = this.rowData.map(x => {
      return {
        'Skill': x?.skill?.skillName,
        'Rating': x?.rating,
        'Rating Card': this.getRatingCard(+x?.rating),
        'Comments': x?.comments,
        'Created On': moment(x?.createdOn).format('YYYY-MM-DD'),
      }
    });
    const headers: any[] = ['Skill', 'Rating', 'Rating Card', 'Comments', 'Created On',];
    this.fileService.generateReport('Test', headers, pdfData, "skill-report", 'Skill Report', true);
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


  closeModal = () => {
    this.matDialogRef.close();
  }
}
