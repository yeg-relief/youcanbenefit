import { Component, OnInit, OnDestroy } from '@angular/core';
import { BrowseService } from './browse.service';
import { Subscription ,  Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-browse',
    templateUrl: './browse.component.html',
    styleUrls: ['./browse.component.css'],
})
export class BrowseComponent implements OnInit, OnDestroy {
    categories: Observable<string[]>;
    errorMsg = '';
    subscriptions: Subscription[] = [];

    currentCategory: string;

    constructor(
        private browseService: BrowseService,
        private route: ActivatedRoute,
        private router: Router,
    ) { }

    ngOnInit() {


        this.categories = this.browseService
            .getCategories()
            .take(1)
            .map(categories => categories.sort( (a, b) => a.localeCompare(b)) );


        this.subscriptions.push(
            this.route.firstChild.params.subscribe(params => {
                this.currentCategory = params['category'];
            })
        );

        if(this.route.snapshot.queryParams.program){
            this.router.navigate([`./${this.currentCategory}`], { relativeTo: this.route});
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => {
            if(!sub.closed){
                sub.unsubscribe();
            }
        });
    }

    selectChange($event) {
        const category = $event.target.value;
        this.currentCategory = category;
        this.router.navigate([`/browse-programs/${category}`]);
    }
}
