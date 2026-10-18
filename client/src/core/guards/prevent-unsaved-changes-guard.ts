import { CanActivateFn, CanDeactivateFn } from '@angular/router';
import { MemberProfile } from '../../feature/members/member-profile/member-profile';

export const preventUnsavedChangesGuard: CanDeactivateFn<MemberProfile> = (component) => {
    if (component.editorm?.dirty) {
        return confirm('Are you sure you want to continue? All unsaved changes will be lost');
    }
    
    return true;
};

