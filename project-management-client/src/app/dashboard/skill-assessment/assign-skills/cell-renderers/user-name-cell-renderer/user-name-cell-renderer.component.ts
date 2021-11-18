import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from "ag-grid-community";

@Component({
  selector: 'app-user-name-cell-renderer',
  templateUrl: './user-name-cell-renderer.component.html',
  styleUrls: ['./user-name-cell-renderer.component.scss']
})
export class UserNameCellRendererComponent implements OnInit {

  data: any;

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
