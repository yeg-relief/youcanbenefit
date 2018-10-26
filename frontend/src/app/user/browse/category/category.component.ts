import { Component, OnInit } from '@angular/core';
@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styles: [
        `:host{
            overflow-x: hidden;
        }`
    ]

})
export class CategoryComponent implements OnInit{
    ngOnInit(){}
}
