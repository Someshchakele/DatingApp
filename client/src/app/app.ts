import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('client');
  private http = inject(HttpClient);
  protected members = signal<any>([])

  async ngOnInit(){
    this.members.set(await this.getMembers())
  }

  async getMembers(){
    try{
      return lastValueFrom(this.http.get('http://localhost:5113/api/members'))
    }
    catch(error){console.log(error);
    throw error;
    }
  }

}
