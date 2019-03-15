import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { HomeComponent } from './user/home/home.component';
import { AboutPageComponent } from './user/page/about-page/about-page.component';
import { ResourcesPageComponent } from './user/page/resources-page/resources-page.component';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'admin', loadChildren: './admin/admin.module#AdminModule' },
  { path: 'about', component: AboutPageComponent},
  { path: 'resources', component: ResourcesPageComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];


export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
