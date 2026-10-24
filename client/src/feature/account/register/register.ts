import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { RegisterCreds, User } from '../../../types/user';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AccountService } from '../../../core/services/account-service';
import { TextInput } from '../../../shared/text-input/text-input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, TextInput],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  private accountService = inject(AccountService);
  private fb = inject(FormBuilder);
  cancelRegister = output<boolean>();
  protected creds = {} as RegisterCreds;
  protected credentialsForm!: FormGroup;
  protected profileForm!: FormGroup;
  protected currentStep = signal(1);
  protected validationErrors = signal<string[]>([]);
  private router = inject(Router);

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.credentialsForm = this.fb.group({
      email: new FormControl('johndoe@test.com', [Validators.required, Validators.email]),
      displayName: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(8),
      ]),
      confirmPassword: new FormControl('', [Validators.required, this.matchValues('password')]),
    });
    this.credentialsForm.controls['password'].valueChanges.subscribe(() => {
      this.credentialsForm.controls['confirmPassword'].updateValueAndValidity();
    });

   this.profileForm = this.fb.group({
      dateOfBirth: new FormControl(''),
      city: new FormControl('',Validators.required),
      country: new FormControl('',Validators.required),
      gender: new FormControl('male',Validators.required),
    });
   
  }

  nextStep() {
    if (this.credentialsForm.valid) {
      this.currentStep.update((prevStep) => prevStep + 1);
    }
  }

  prevStep() {
    this.currentStep.update((prevStep) => prevStep - 1);
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control.parent;
      if (!parent) return null;

      const matchValue = parent.get(matchTo)?.value;
      return control.value === matchValue ? null : { passwordMismatch: true };
    };
  }

  getMaxDate() {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split('T')[0];
  }

  register() {
    console.log(this.credentialsForm.value);
    if (this.profileForm.valid && this.credentialsForm.valid) {
      const formData = { ...this.credentialsForm.value, ...this.profileForm.value };
      console.log(formData ," formdata")
      this.accountService.register(formData).subscribe({
        next: () => {
          console.log("success")
          this.router.navigateByUrl('/members');
        },
        error: error => {
            console.log(error);
            this.validationErrors.set(error);
        }
    })
    }

  }

  cancel() {
    console.log('cancelled');
    this.cancelRegister.emit(false);
  }
}
