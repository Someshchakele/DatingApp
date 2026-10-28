import { Component, HostListener, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditableMember, Member } from '../../../types/member';
import { DatePipe } from '@angular/common';
import { MemberService } from '../../../core/services/member-service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../core/services/toast-service';
import { AccountService } from '../../../core/services/account-service';
import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe,FormsModule,TimeAgoPipe],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css',
})
export class MemberProfile implements OnInit{
  @ViewChild('editForm') editorm?:NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event: BeforeUnloadEvent) {
    if (this.editorm?.dirty) {
        $event.preventDefault();
    }
}
  protected memberService = inject(MemberService)
  // private route = inject(ActivatedRoute);
  private toast = inject(ToastService);
  protected accountService = inject(AccountService)
  // protected member = signal<Member | undefined>(undefined)
  protected editableMember:EditableMember = {
      displayName:'',
      description: '',
      city: '',
      country: ''
  }

  ngOnInit(){
    // this.route.parent?.data.subscribe(data=>{
    //   this.member.set(data['member']);
    // })
    this.editableMember = {
      displayName:this.memberService.member()?.displayName || '',
      description:this.memberService.member()?.description || '',
      city:this.memberService.member()?.city || '',
      country:this.memberService.member()?.country || '',
    }
  }

  updateProfile() {
    if (!this.memberService.member()) return;
    const updatedMember = {...this.memberService.member(), ...this.editableMember}
    console.log(updatedMember);
    this.memberService.updateMember(this.editableMember).subscribe({
      next:()=>{
        const currentUser = this.accountService.currentUser();
        if (currentUser && updatedMember.displayName !== currentUser?.displayName) {
            currentUser.displayName = updatedMember.displayName;
            this.accountService.setCurrentUser(currentUser);
        }

          this.toast.success('Profile updated successfully');
          this.memberService.editMode.set(false);
          this.memberService.member.set(updatedMember as Member)
          this.editorm?.reset(updatedMember);
      }})
  
}

ngOnDestroy(){
  if(this.memberService.editMode()){
    this.memberService.editMode.set(false);
  }
}
}
