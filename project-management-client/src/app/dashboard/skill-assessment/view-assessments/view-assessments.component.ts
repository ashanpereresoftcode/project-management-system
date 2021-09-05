import { Component, OnInit, OnDestroy } from '@angular/core';
import { ColDef, GridApi, GridOptions } from "ag-grid-community";
import { MatDialog } from '@angular/material/dialog';
import { CreateAssessmentComponent } from '../create-assessment/create-assessment.component';
import { SkillCellRendererComponent } from '../skill-cell-renderer/skill-cell-renderer.component';
import { SkillAssessmentService } from '../../../shared/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-assessments',
  templateUrl: './view-assessments.component.html',
  styleUrls: ['./view-assessments.component.scss']
})
export class ViewAssessmentsComponent implements OnInit, OnDestroy {

  gridApi!: GridApi;
  gridColumnApi: any;

  columnDefs!: ColDef[];
  defaultColDef!: ColDef;
  rowData: any[] = [];
  gridOption!: GridOptions;
  skillSubscriptions: Subscription[] = [];

  constructor(
    public dialog: MatDialog,
    private skillAssessmentService: SkillAssessmentService) {

    this.columnDefs = [
      {
        field: 'skillName',
        headerName: 'Skill Name',
        suppressAutoSize: true,
        width: 150
      },
      {
        field: 'skillCode',
        headerName: 'Skill Code',
        suppressAutoSize: true,
        width: 150
      },
      {
        field: 'description',
        headerName: 'Description',
        width: 120,
        suppressAutoSize: true,
      },
      {
        headerName: 'Actions',
        width: 55,
        cellRendererFramework: SkillCellRendererComponent
      }
    ];
    this.defaultColDef = { resizable: true };
  }

  ngOnInit(): void {
    this.rowData =
      [
        {
          skillName: "C#",
          skillCode: "C#",
          description: "Dotnet"
        }
      ]

    this.skillCreateListener();
    this.skillDeleteListener();
  }

  skillCreateListener = () => {
    this.skillSubscriptions.push(this.skillAssessmentService.afterSave.subscribe(result => {
      if (result) {
        if (result && result.isEditMode) {
          // map function.
        } else {
          this.rowData.push(result);
          this.gridApi.setRowData(this.rowData);
        }
      }
    }))
  }

  skillDeleteListener = () => {
    this.skillSubscriptions.push(this.skillAssessmentService.afterDelete.subscribe(result => {
      debugger
      if (result) {
        // remove data from the array.
      }
    }))
  }


  openModal = () => {
    this.dialog.open(CreateAssessmentComponent, {
      width: '50%',
      height: 'auto',
      data: null
    });
  }

  sizeToFit = () => {
    this.gridApi.sizeColumnsToFit();
  }

  onGridReady = (params: any) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.sizeToFit();
  }

  ngOnDestroy = () => {
    if (this.skillSubscriptions && this.skillSubscriptions.length > 0) {
      this.skillSubscriptions.forEach(e => {
        e.unsubscribe();
      })
    }
  }
}
