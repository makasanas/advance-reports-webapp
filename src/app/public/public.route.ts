import { Routes } from '@angular/router';
import { InstallComponent } from './install/install.component';
import { AuthComponent } from './auth/auth.component';

export const PUBLIC_ROUTES: Routes = [
    {
        path: 'install',
        component: InstallComponent
    },
    {
        path: 'auth',
        component: AuthComponent
    },
];

