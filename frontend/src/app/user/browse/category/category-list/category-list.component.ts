import { Component, OnInit } from '@angular/core';
import { UserFacingProgram } from '../../../../shared';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { BrowseService } from '../../browse.service';

@Component({
    selector: 'app-category-list',
    templateUrl: './category-list.component.html',
    styleUrls: ['./category-list.component.css'],
})
export class CategoryListComponent implements OnInit {
    programs: UserFacingProgram[] = [];
    filteredPrograms: UserFacingProgram[] = [];
    loading = false;
    timeout;

    constructor(
        private route: ActivatedRoute,
        private browseService: BrowseService,
        private router: Router    
    ) {}

    ngOnInit(){
        this.timeout = setTimeout(() => this.loading = true, 100);
        this.browseService.getAllPrograms()
            .then(programs => this.loadPrograms(programs))
            .catch(error => console.error(error));

        this.router.events.subscribe(event => {
            if(event instanceof NavigationEnd) {
                try {
                    const category = event.url.split("/")[2]
                    this.filterByCategory(category)
                } catch(e){
                    alert("oops something went wrong.")
                    console.error(e)
                }
            }
        })
    }

    filterByCategory(category: string) {
        if (category === 'all') {
            this.filteredPrograms = this.programs.sort((a, b) => a.title.localeCompare(b.title));
        } else {
            this.filteredPrograms =
                this.programs.filter(program => program.tags.indexOf(category) >= 0)
                    .sort((a, b) => a.title.localeCompare(b.title));
        }
    }

    loadPrograms(programs: UserFacingProgram[]): Promise<any> {
        this.programs = [...programs];
        this.filterByCategory(this.route.snapshot.params['category']);
        this.loading = false;
        clearTimeout(this.timeout);
        return Promise.resolve();
    }

}
