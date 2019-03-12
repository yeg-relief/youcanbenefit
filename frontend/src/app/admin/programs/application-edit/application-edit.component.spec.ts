import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QueryDisplayComponent } from './query-display/query-display.component'
import { ApplicationEditComponent } from './application-edit.component';
import { MdIconModule, MdButtonToggleModule, MdSnackBar, MdSnackBarModule } from '@angular/material'
import { RouterModule, ActivatedRoute } from "@angular/router";
import { QueryEditV3Component } from './query-edit-v3/query-edit-v3.component'
import { ConditionEditV3Component } from './condition-edit-v3/condition-edit-v3.component';
import { ReactiveFormsModule } from "@angular/forms";
import { ProgramModelService } from '../services/program-model.service'
import { QueryService } from '../services/query.service';

/* TODO: need to mock services to get this to compile. */


describe('ApplicationEditComponent', () => {
    let component: ApplicationEditComponent;
    let fixture: ComponentFixture<ApplicationEditComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MdIconModule,
                RouterModule,
                ReactiveFormsModule,
                MdButtonToggleModule,
                MdSnackBarModule
            ],
            declarations: [
                ApplicationEditComponent,
                QueryDisplayComponent,
                QueryEditV3Component,
                ConditionEditV3Component
            ],
            providers: [
                ProgramModelService,
                QueryService,
                MdSnackBar,
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ApplicationEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
