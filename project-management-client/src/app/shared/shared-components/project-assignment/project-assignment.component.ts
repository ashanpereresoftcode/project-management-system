import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColDef, GridApi, GridOptions } from "ag-grid-community";
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ProjectManagementService, AuthService } from '../../services';
import { ProjectAssignCellRendererComponent } from '../project-assign-cell-renderer/project-assign-cell-renderer.component';

@Component({
  selector: 'app-project-assignment',
  templateUrl: './project-assignment.component.html',
  styleUrls: ['./project-assignment.component.scss']
})
export class ProjectAssignmentComponent implements OnInit {

  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions!: Observable<string[]> | undefined;

  projectAssignmentForm!: FormGroup;
  projects: any;

  currentRating: number = 0;
  skills: any[] = [];

  gridApi!: GridApi;
  gridColumnApi: any;

  columnDefs!: ColDef[];
  defaultColDef!: ColDef;
  rowData: any[] = [];
  gridOption!: GridOptions;


  constructor(
    public matDialogRef: MatDialogRef<ProjectAssignmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private projectManagementService: ProjectManagementService,
    private authService: AuthService) {
    this.columnDefs = [
      {
        field: 'firstName',
        headerName: 'First Name',
        suppressAutoSize: true,
        width: 120
      },
      {
        field: 'userEmail',
        headerName: 'Email',
        width: 120,
        suppressAutoSize: true,
      },
      {
        headerName: 'Assign',
        width: 100,
        cellRendererFramework: ProjectAssignCellRendererComponent
      }
    ];
    this.defaultColDef = { resizable: true };
  }

  ngOnInit(): void {
    this.initializeForm();
    this.filterOptionValueChanges();
    this.fetchProjects();
  }

  fetchProjects = () => {
    this.projectManagementService.getAllProjects().subscribe(projects => {
      if (projects) {
        this.projects = projects.result;
      }
    }, error => {
      console.log(error);
    })
  }

  initializeForm = () => {
    this.projectAssignmentForm = new FormGroup({
      selectedProject: new FormControl(null, Validators.required),
      assignedUsers: new FormControl(null, Validators.required)
    });

    this.projectAssignmentForm?.get('selectedProject')?.valueChanges.subscribe(result => {
      if (result) {
        const project = this.projects.find((p: any) => p.projectCode === result);
        this.projectManagementService.projectInformation = project;
        this.loadUsers();
      }
    })
  }

  loadUsers = () => {
    this.authService.fetchUsers().subscribe(userResult => {
      if (userResult) {
        this.rowData = userResult.result;
      }
    })
  }

  onGridReady = (params: any) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.sizeToFit();
  }

  sizeToFit = () => {
    this.gridApi.sizeColumnsToFit();
  }

  filterOptionValueChanges = () => {
    this.filteredOptions = this.projectAssignmentForm.get('selectedProject')?.valueChanges.pipe(startWith(''), map(value => this._filter(value)));
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  closeModal = () => {
    this.matDialogRef.close();
  }

  assignProject = () => {

  }

}
