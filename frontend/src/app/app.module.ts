import { BrowserModule,  } from '@angular/platform-browser';
import { NgModule,  } from '@angular/core';
import { routing }  from './app.routes';
import { AppComponent } from './app.component';
import { MaterialModule } from '@angular/material';
import { ToolbarComponent } from './shared/components/toolbar/toolbar.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { AboutComponent } from './user/about/about.component';
import { MasterScreenerModule } from './user/master-screener/master-screener.module';
import { BrowseModule } from './user/browse/browse.module';
import { HomeComponent } from './user/home/home.component';
import { MasterScreenerService } from './user/master-screener/master-screener.service';
import { BrowseService } from './user/browse/browse.service';
import { AuthService } from './admin/core/services/auth.service'
import { AuthGuardService } from './admin/core/services/auth-guard.service';
import { QuickLinksComponent } from './user/quick-links/quick-links.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { ConstructionRibbonComponent } from './construction-ribbon/construction-ribbon.component';
import { IeSucksComponent } from './user/home/ie-sucks/ie-sucks.component';
import { ProgramsServiceService } from './user/programs-service.service';
import { QuickLinksContentComponent } from './user/quick-links/quick-links-content/quick-links-content.component';
import { InitialRedirectService } from "./initial-redirect.service";
import { HttpClientModule}  from '@angular/common/http'

@NgModule({
    declarations: [
        AppComponent,
        ToolbarComponent,
        PageNotFoundComponent,
        AboutComponent,
        HomeComponent,
        QuickLinksComponent,
        ConstructionRibbonComponent,
        IeSucksComponent,
        QuickLinksContentComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MasterScreenerModule,
        BrowseModule,
        routing,
        MaterialModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    providers: [
        MasterScreenerService,
        BrowseService,
        AuthService,
        AuthGuardService,
        ProgramsServiceService,
        InitialRedirectService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
