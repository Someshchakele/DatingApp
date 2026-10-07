import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Nav } from '../layout/nav/nav';
import { AccountService } from '../core/services/account-service';
import { Home } from '../feature/home/home';
import { User } from '../types/user';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav, Home],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('client');
  private http = inject(HttpClient);
  protected members = signal<User[]>([])
  private accountService = inject(AccountService)

  async ngOnInit(){
    this.members.set(await this.getMembers())
    console.log(this.members)
    this.setCurrentUser();
  }

  setCurrentUser(){
    const userString = localStorage.getItem('user');
    if(!userString) return;
    const user = JSON.parse(userString);
    this.accountService.currentUser.set(user)
  }

  async getMembers(){
    try{
      return lastValueFrom(this.http.get<User[]>('https://localhost:5113/api/members'))
    }
    catch(error){console.log(error);
    throw error;
    }
  }

}
