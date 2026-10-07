import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  protected accountsService = inject(AccountService);
  protected creds: any = {}



  login(){
   this.accountsService.login(this.creds).subscribe({
    next: result => {
      console.log(result)
     
    },
    error: error => console.log(this.creds)
   })
  }

  logout(){
    this.accountsService.logout()
   
  }

}
