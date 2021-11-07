import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from "ag-grid-community";
import { ProjectAllocation } from '../../../../../shared/enums/project-allocation.enum';

@Component({
  selector: 'app-project-allocation',
  templateUrl: './project-allocation.component.html',
  styleUrls: ['./project-allocation.component.scss']
})
export class ProjectAllocationComponent implements OnInit {

  data: any;
  projectAllocation: any = ProjectAllocation;

  constructor() { }

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
    return params?.data;
  }
}