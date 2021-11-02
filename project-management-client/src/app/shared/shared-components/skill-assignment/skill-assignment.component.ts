import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColDef, GridApi, GridOptions } from "ag-grid-community";
import { Observable, Subscription } from 'rxjs';
import { SkillCellRendererComponent } from './skill-cell-renderer/skill-cell-renderer.component';
import { SkillAssessmentService, AuthService } from '../../services';

@Component({
  selector: 'app-skill-assignment',
  templateUrl: './skill-assignment.component.html',
  styleUrls: ['./skill-assignment.component.scss']
})
export class SkillAssignmentComponent implements OnInit {

  @Output() afterSkillAssignment: EventEmitter<boolean> = new EventEmitter<boolean>();

  closeExpansion!: boolean;
  filteredSkills: Observable<any[]> | undefined;
  selectedSkill: any;
  subscriptions: Subscription[] = [];
  skills: any[] = [];
  skillAssignFormGroup!: FormGroup;
  currentRating: number = 0;

  gridApi!: GridApi;
  gridColumnApi: any;

  columnDefs!: ColDef[];
  defaultColDef!: ColDef;
  rowData: any[] = [];
  gridOption!: GridOptions;
  skillSubscriptions: Subscription[] = [];

  panelOpenState = false;

  constructor(
    public matDialogRef: MatDialogRef<SkillAssignmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private skillAssessmentService: SkillAssessmentService) {
    matDialogRef.disableClose = false;
  }

  ngOnInit(): void {
    this.matDialogRef.disableClose = true;
    this.initializeFormGroup();
    this.initializeColumns();
    this.loadAllSkills();
  }

  initializeColumns = () => {
    this.columnDefs = [
      {
        headerName: 'Skill',
        suppressAutoSize: true,
        width: 120,
        cellRendererFramework: SkillCellRendererComponent
      },
      {
        field: 'rating',
        headerName: 'Rating',
        suppressAutoSize: true,
        editable: true,
        width: 150
      },
    ]
  }

  initializeFormGroup = () => {
    this.skillAssignFormGroup = new FormGroup({
      skill: new FormControl(null, Validators.required),
      rating: new FormControl(null),
      comments: new FormControl(null)
    })
  }

  loadAllSkills = () => {
    this.subscriptions.push(this.skillAssessmentService.getAllSkills().subscribe((skills: any) => {
      if (skills && skills.validity) {
        console.log(skills);
        this.skills = skills.result;
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
    if (this.skillAssignFormGroup.valid) {
      const assignedSkill = this.skillAssignFormGroup.value;
      this.skillAssessmentService.saveAssignedSkill(assignedSkill).subscribe(savedResult => {
        if (savedResult) {
          this.afterSkillAssignment.emit(this.skillAssignFormGroup.value);
          this.closeModal();
        }
      })
    } else {
      console.log(this.skillAssignFormGroup.errors);
    }
  }
}
