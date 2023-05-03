import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserService } from '../../_services/user.service';
import { SsoService } from 'src/app/_services/sso.service';

import {VlUser} from '../../_models/vl-user.model';

/**
 * @Todo make a smart/dumb component (with @Input user)
 */
@Component({
  selector: 'vl-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {

  userSubscriber: Subscription;
  currentUser: VlUser = null;
  isAdmin: boolean;
  userName: string;

  constructor(private userService: UserService,
              private ssoService: SsoService,
              private router: Router) { }

  ngOnInit() {
    this.userSubscriber = this.userService.currentVlUser.subscribe(
      user => {
        this.currentUser = user;
        this.isAdmin = this.userService.isAdmin();
        this.userName = this.userService.getUserName();
      }, error => {
        // @Todo manage error
        // Should logout ?
        console.log(error);
      }
      );
  }

  ngOnDestroy() {
    if (this.userSubscriber) { this.userSubscriber.unsubscribe(); }
  }

  login() {
    const redirectUrl = this.router.routerState.snapshot.url;
    this.router.navigate(['/login'], {queryParams: {redirectUrl}});
  }

  logout() {
    this.ssoService.logout();
  }

}
