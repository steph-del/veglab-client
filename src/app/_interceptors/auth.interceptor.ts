import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { SsoService } from '../_services/sso.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private apiBaseUrl: string = environment.apiBaseUrl;
  private ssoBaseUrl: string = environment.sso.baseUrl;
  private ssoLoginUrl: string = environment.sso.loginEndpoint;
  private esBaseUrl: string = environment.esBaseUrl;
  private esAuthorizationPassword: string = environment.esAuthorizationPassword;
  private esRepoAuthorizationPassword: string = environment.esRepoAuthorizationPassword;

  constructor(private ssoService: SsoService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add authorization request header if needed
    if (this.needsApiToken(request)) {
      const token = this.ssoService.getToken();
      if (token !== null) {
        request = request.clone({
          setHeaders: {
              Authorization: `Bearer ${token}`
          }
        });
      }
    } else if (this.needsEsToken(request)) {
      request = request.clone({
        setHeaders: {
            Authorization: `Basic ${btoa('elastic:' + this.esAuthorizationPassword)}`
        }
      });
    } else if (this.needsEsRepoToken(request)) {
      request = request.clone({
        setHeaders: {
            Authorization: `Basic ${btoa('elastic:' + this.esRepoAuthorizationPassword)}`
        }
      });
    }
    return next.handle(request);
  }

  private needsApiToken(request: HttpRequest<any>): boolean {
    if (request.url.startsWith(this.ssoLoginUrl)) {
      return false;
    } else if (request.url.startsWith(this.apiBaseUrl)) {
      // API request
      const token = this.ssoService.getToken();
      return token ? true : false;
    } else {
      return false;
    }
  }

  /**
   * Is an Elasticsearch request for VegLab's ES service ?
   */
  private needsEsToken(request: HttpRequest<any>): boolean {
    if (request.url.startsWith(this.esBaseUrl)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Is an Elasticsearch request for the repositories ES service ?
   */
  private needsEsRepoToken(request: HttpRequest<any>): boolean {
    if (request.url.indexOf('51.38.37.216:9200') !== -1) {
      return true;
    } else {
      return false;
    }
  }

}
