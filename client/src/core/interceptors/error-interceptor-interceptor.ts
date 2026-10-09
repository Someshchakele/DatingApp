import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastService } from '../services/toast-service';
import { NavigationExtras, Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const router = inject(Router);

  return next(req).pipe(
    catchError(error => {
        if (error) {
            switch (error.status) {
                case 400:
                    if(error.error.errors){
                      const modelStateError = [];
                      for(const key in error.error.errors){
                        if(error.error.errors[key]){
                          modelStateError.push(error.error.errors[key])
                        }
                      }
                      throw modelStateError.flat();
                    }
                    else{
                      toast.error(error.error + ' ', error.status)
                    }
                    break;
                case 401:
                    toast.error('Unauthorized');
                    break;
                case 404:
                    router.navigateByUrl('/not-found')
                    break;
                case 500:
                    const navigateExtras:NavigationExtras = {state: {error:error.error}}
                    router.navigateByUrl('/server-error',navigateExtras)
                    break;
                default:
                    toast.error('Something went wrong');
                    break;
            }
        }
        throw error
    })
);4
};
