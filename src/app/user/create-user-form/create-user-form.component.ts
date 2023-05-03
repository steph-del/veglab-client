import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { VlUser } from 'src/app/_models/vl-user.model';

import { UserService } from 'src/app/_services/user.service';
import { NotificationService } from 'src/app/_services/notification.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'vl-create-user-form',
  templateUrl: './create-user-form.component.html',
  styleUrls: ['./create-user-form.component.scss']
})
export class CreateUserFormComponent implements OnInit, OnDestroy {
  @Input() redirectAfterAccountCreated = true;
  @Input() resetFormAfterAccountCreated = false;

  // VAR Form
  form: FormGroup;
  emailValueSubscr: Subscription;
  emailVerificationValueSubscr: Subscription;
  emailCtrl = new FormControl('', [Validators.required, Validators.email]);
  emailVerificationCtrl = new FormControl('', [Validators.required, Validators.email]);

  // VARS
  title = 'Créer un compte';
  creatingUser = false;
  userHasBeenCreated: VlUser = null;

  constructor(private userService: UserService,
              private notificationService: NotificationService,
              public router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      firstname: new FormControl('', [Validators.required, Validators.pattern('[A-zÀ-ú(.)(\-)( )?]*')]),
      lastname: new FormControl('', [Validators.required, Validators.pattern('[A-zÀ-ú(.)(\-)( )?]*')]),
      email: this.emailCtrl,
      emailVerification: this.emailVerificationCtrl,
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      // passwordVerification: new FormControl('', [Validators.required, Validators.pattern('^[a-z]+')])
    });

    this.emailValueSubscr = this.emailCtrl.valueChanges.subscribe(value => {
      if (this.emailCtrl.value !== this.emailVerificationCtrl.value) {
        this.emailVerificationCtrl.setErrors({ emailDoesNotMatch: true });
      } else {
        this.emailVerificationCtrl.setErrors(null);
      }
    });

    this.emailVerificationValueSubscr = this.emailVerificationCtrl.valueChanges.subscribe(value => {
      if (this.emailCtrl.value !== this.emailVerificationCtrl.value) {
        this.emailVerificationCtrl.setErrors({ emailDoesNotMatch: true });
      } else {
        this.emailVerificationCtrl.setErrors(null);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.emailVerificationValueSubscr) { this.emailVerificationValueSubscr.unsubscribe(); }
    if (this.emailValueSubscr) { this.emailValueSubscr.unsubscribe(); }
  }

  logErrors(): void {
    const errors = this.form.errors;
    console.log(errors);
  }

  createUser(ev: Event): void {
    ev.preventDefault();
    console.log('CREATE USER');
    // Are fields valid ?
    if (this.form.valid) {
      console.log('form is valid');
      this.creatingUser = true;
      console.log('create new user...');
      const newUser: VlUser = {
        id: null,
        firstname: this.form.controls.firstname.value,
        lastname: this.form.controls.lastname.value,
        email: this.emailCtrl.value,
        acronym: null,
        roles: []
      };
      console.log('CREATE USER WITH', newUser);
      this.userService.createUser(newUser).subscribe(createdUser => {
        this.creatingUser = false;

        if (this.resetFormAfterAccountCreated === true) {
          // Reset component
          this.notificationService.notify(`Le compte '${createdUser.email}' a bien été créé`);
          this.creatingUser = false;
          this.userHasBeenCreated = null;
          this.form.reset();
        } else {
          this.userHasBeenCreated = createdUser;
          this.title = 'Votre compte a été créé';

          // Redirect after X sec
          if (this.redirectAfterAccountCreated === true) {
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 5000);
          }
        }
      }, er => {
        this.creatingUser = false;
        if (er.error && er.error['hydra:description'] !== null) {
          this.notificationService.error(er.error['hydra:description']);
        } else {
          this.notificationService.error('Une erreur est survenue lors de la création de l\'utilisateur');
        }
        console.log(er);
      });
    } else {
      console.log('Form is not valid');
      // Form is not valid,
      // Form Validators show what's wrong
    }
  }

  // tslint:disable-next-line:member-ordering
  static sameEmailValidator(control: FormControl): { [key: string]: boolean } | null {
    return control.parent.controls['emailVerification'].value === control.value ? null : { emailDoesNotMatch: true };
  }

}
