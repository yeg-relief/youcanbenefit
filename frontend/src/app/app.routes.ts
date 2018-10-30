import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { AboutComponent } from './user/about/about.component';
import { HomeComponent } from './user/home/home.component';
import { QuickLinksComponent } from './user/quick-links/quick-links.component';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'admin', loadChildren: 'app/admin/admin.module#AdminModule'
  },
  { path: 'about', component: AboutComponent},
  { path: 'quick-links', component: QuickLinksComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];


export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
