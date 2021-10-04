import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from "ag-grid-community";

@Component({
  selector: 'app-assigned-skill-card-cell-renderer',
  templateUrl: './assigned-skill-card-cell-renderer.component.html',
  styleUrls: ['./assigned-skill-card-cell-renderer.component.scss']
})
export class AssignedSkillCardCellRendererComponent implements OnInit {

  data: any;
  ratingCard!: string;
  constructor() { }

  ngOnInit(): void {
  }

  agInit(params: ICellRendererParams): void {
    if (params && params.data) {
      this.data = params.data;
      this.getRatingCard(+this.data.rating);
    }
  }

  refresh(params: ICellRendererParams) {
    this.data = this.getValueToDisplay(params);
    this.getRatingCard(this.data.rating);
  }

  getRatingCard = (rate: number): void => {
    switch (rate) {
      case 0:
        this.ratingCard = "N/A";
        break;
      case 1:
        this.ratingCard = "Fundamental Awareness (basic knowledge)";
        break;
      case 2:
        this.ratingCard = "Novice (limited experience)";
        break;
      case 3:
        this.ratingCard = "Intermediate (practical application)";
        break;
      case 4:
        this.ratingCard = "Advanced (applied theory)";
        break;
      case 5:
        this.ratingCard = "Expert (recognized authority)";
        break;
    }
  }


  getValueToDisplay(params: ICellRendererParams) {
    return params?.data;
  }
}
