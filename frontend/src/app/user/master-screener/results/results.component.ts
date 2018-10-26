import { Component, OnInit } from '@angular/core';
import { MasterScreenerService } from '../master-screener.service';
import { Animations } from '../../../shared/animations';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
  animations: [
    Animations.flyinHalf
  ]
})
export class ResultsComponent implements OnInit {
  errorMessage: string;
  results = [];

  constructor(private masterScreenerService: MasterScreenerService) { }

  ngOnInit() {
    if (this.masterScreenerService.results !== undefined &&  Array.isArray(this.masterScreenerService.results))
      this.results = [...this.masterScreenerService.results];
    else 
      this.errorMessage = 'error loading results, try again later.'; 
  }
}
