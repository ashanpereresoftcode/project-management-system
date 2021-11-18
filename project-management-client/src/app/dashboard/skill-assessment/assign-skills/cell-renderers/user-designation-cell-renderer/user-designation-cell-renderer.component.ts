import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from "ag-grid-community";

@Component({
  selector: 'app-user-designation-cell-renderer',
  templateUrl: './user-designation-cell-renderer.component.html',
  styleUrls: ['./user-designation-cell-renderer.component.scss']
})
export class UserDesignationCellRendererComponent implements OnInit {
  data: any;
  assignedDesignation: any;
  designations: any[] = [
    { key: 'ASE', viewValue: 'Associate Software Engineer' },
    { key: 'SE', viewValue: 'Software Engineer' },
    { key: 'SSE', viewValue: 'Senior Software Engineer' },
    { key: 'ATL', viewValue: 'Associate Technical Lead' },
    { key: 'TL', viewValue: 'Technical Lead' },
    { key: 'AT', viewValue: 'Architecht' },
    { key: 'PM', viewValue: 'Project Manager' },
    { key: 'CEO', viewValue: 'CEO' },
    { key: 'SC', viewValue: 'Software Consultant' },
    { key: 'AA', viewValue: 'Associate Architect' },
    { key: 'STL', viewValue: 'Senior Technical Lead' },
    { key: 'APM', viewValue: 'Associate Project Manager' },
    { key: 'APM', viewValue: 'Associate Project Manager' },
    { key: 'AQL', viewValue: 'Associate QA Lead' },
    { key: 'AQM', viewValue: 'Associate QA Manager' },
    { key: 'AUL', viewValue: 'Associate UI Lead' },
    { key: 'SQAL', viewValue: 'Senior Quality Assurance Lead' },
    { key: 'SQA', viewValue: 'Senior Quality Assurance Engineer' },
    { key: 'UL', viewValue: 'UI Lead' },
    { key: 'UE', viewValue: 'UI Engineer' },
    { key: 'QE', viewValue: 'QA Engineer' },
    { key: 'UXE', viewValue: 'UX Engineer' },
    { key: 'BA', viewValue: 'Business Analyst' },
    { key: 'AUXL', viewValue: 'Associate UX Lead' },
    { key: 'ADSE', viewValue: 'Associate Data Science Engineer' },
    { key: 'HPM', viewValue: 'Head of Project Management' },
    { key: 'DMS', viewValue: 'Degital Marketing Specialist' },
    { key: 'EAHR', viewValue: 'Executive - Admin & HR' },
    { key: 'NSA', viewValue: 'Network & Systems Administrator' },
    { key: 'SEFA', viewValue: 'Senior Executive - Finance and Administration' },
  ];


  constructor() { }

  ngOnInit(): void {
  }

  agInit(params: ICellRendererParams): void {
    if (params && params.data) {
      this.data = params.data;
      this.assignedDesignation = this.designations.find(x => x.key === this.data?.user?.designation);
    }
  }

  refresh(params: ICellRendererParams) {
    this.data = this.getValueToDisplay(params);
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params?.data;
  }


}
