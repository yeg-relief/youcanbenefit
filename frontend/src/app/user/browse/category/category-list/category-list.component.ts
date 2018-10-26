import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { UserFacingProgram } from '../../../../shared';
import { ActivatedRoute  } from '@angular/router';
import { BrowseService } from '../../browse.service';
import { Animations } from '../../../../shared/animations';

@Component({
    selector: 'app-category-list',
    templateUrl: './category-list.component.html',
    styleUrls: ['./category-list.component.css'],
    animations: [
        Animations.fadeinAndOut
    ]
})
export class CategoryListComponent implements OnInit {
    programs: UserFacingProgram[] = [];
    filteredPrograms: UserFacingProgram[] = [];
    subscription: Subscription;
    loading = false;
    fade;
    timeout;

    constructor(
        private route: ActivatedRoute,
        private browseService: BrowseService) {}

    ngOnInit(){
        this.timeout = setTimeout(() => this.loading = true, 100);
        this.browseService.getAllPrograms()
            .then(programs => this.loadPrograms(programs))
            .catch(error => console.error(error));

        // no need to unsubscribe https://youtu.be/WWR9nxVx1ec?t=20m18s
        // and yet complete is never called.... going to unsub, but should investigate
        // if this implies subscription is still active.
        this.subscription = this.route.params.subscribe({
            next: (params) => {
                this.fade = 'out';
            }
        });
    }

    ngOnDestroy(){
        if (!this.subscription.closed) {
            this.subscription.unsubscribe();
        }

    }

    filterByCategory(category: string) {
        if (category === 'all') {
            this.filteredPrograms = this.programs.sort((a, b) => a.title.localeCompare(b.title));
        } else {
            this.filteredPrograms =
                this.programs.filter(program => program.tags.indexOf(category) >= 0)
                    .sort((a, b) => a.title.localeCompare(b.title));
        }
        this.fade = 'in';
    }

    loadPrograms(programs: UserFacingProgram[]): Promise<any> {
        this.programs = [...programs];
        this.filterByCategory(this.route.snapshot.params['category']);
        this.loading = false;
        clearTimeout(this.timeout);
        return Promise.resolve();
    }

    handleFadeDone($event) {
        if ($event.fromState === 'void' && $event.toState === 'null')
            this.fade = 'in';
        else if($event.fromState === 'in' && $event.toState === 'out')
            this.filterByCategory(this.route.snapshot.params['category']);
    }

}
