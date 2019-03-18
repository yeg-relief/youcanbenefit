import { BrowserModule  } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { routing } from './app.routes';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './shared/components/toolbar/toolbar.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { PageComponent } from './user/page/page.component';
import { PageService } from './user/page/page.service';
import { MasterScreenerModule } from './user/master-screener/master-screener.module';
import { BrowseModule } from './user/browse/browse.module';
import { HomeComponent } from './user/home/home.component';
import { MasterScreenerService } from './user/master-screener/master-screener.service';
import { BrowseService } from './user/browse/browse.service';
import { AuthService } from './admin/core/services/auth.service'
import { AuthGuardService } from './admin/core/services/auth-guard.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ConstructionRibbonComponent } from './construction-ribbon/construction-ribbon.component';
import { IeSucksComponent } from './user/home/ie-sucks/ie-sucks.component';
import { ProgramsServiceService } from './user/programs-service.service';
import { InitialRedirectService } from './initial-redirect.service';
import { HttpClientModule} from '@angular/common/http';
import { 
    MatIconModule, 
    MatCardModule, 
    MatDividerModule, 
    MatSidenavModule, 
    MatMenuModule, 
    MatButtonModule, 
    MatSnackBarModule,
    MatTooltipModule
} from '@angular/material';
import { QuillModule } from 'ngx-quill';
import { AboutPageComponent } from './user/page/about-page/about-page.component';
import { ResourcesPageComponent } from './user/page/resources-page/resources-page.component';

@NgModule({
    declarations: [
        AppComponent,
        ToolbarComponent,
        PageNotFoundComponent,
        PageComponent,
        ConstructionRibbonComponent,
        IeSucksComponent,
        HomeComponent,
        AboutPageComponent,
        ResourcesPageComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MasterScreenerModule,
        BrowseModule,
        routing,
        ReactiveFormsModule,
        HttpClientModule,
        MatIconModule,
        MatCardModule,
        MatDividerModule,
        MatSidenavModule,
        MatMenuModule,
        MatButtonModule,
        MatSnackBarModule,
        MatTooltipModule,
        QuillModule,
        FormsModule
    ],
    providers: [
        MasterScreenerService,
        BrowseService,
        AuthService,
        AuthGuardService,
        ProgramsServiceService,
        InitialRedirectService,
        PageService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
