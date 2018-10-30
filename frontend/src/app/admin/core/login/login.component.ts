import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthGuardService } from '../services/auth-guard.service';
import 'rxjs/add/operator/take';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  credentials = {
    username: '',
    password: ''
  };
  active = false;
  invalidLogin = false;
  timeout;


  constructor(
    private authService: AuthService,
    private router: Router,
    private authGuard: AuthGuardService
  ) { }

  ngOnInit() {
    if (this.authService.isLoggedIn) {
      this.router.navigateByUrl('/admin/screener/edit');
    }
  }

  ngOnDestroy(){
    clearTimeout(this.timeout);
  }

  login() {
    this.timeout = setTimeout(() => this.active = true, 100);
    this.authService.login(this.credentials.username, this.credentials.password)
      .take(1)
      .subscribe({
        next: success => {
          if (success) {
            // Get the redirect URL from our auth service
            // If no redirect has been set, use the default
            let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/admin/screener/edit';
            this.authGuard.isLoggedIn = true;
            this.active = false;
            // Redirect the user
            this.router.navigateByUrl(redirect);
          } else {
            this.invalidLogin = true;
            this.active = false;
          }
        },
        error: error => {
          this.invalidLogin = true;
          this.active = false;
        }
      });
  }

}
