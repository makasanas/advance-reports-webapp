import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from './services/auth-guard.service';
import { BothAuthGuard } from './services/both-auth-guard.service';
import { PublicComponent } from './public/public.component';
import { SecureComponent } from './secure/secure.component';
import { PUBLIC_ROUTES } from './public/public.route';
import { SECURE_ROUTES } from './secure/secure.route';
import { AppComponent } from './app.component';


@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: '',  canActivate: [BothAuthGuard],  component: AppComponent },
            { path: '', component: PublicComponent, data: { title: 'Public Views' }, children: PUBLIC_ROUTES },
            { path: '', component: SecureComponent, canActivate: [AuthGuard], data: { title: 'Secure Views' }, children: SECURE_ROUTES },
            {
                path: '**',
                redirectTo: '/'
            },
        ], { scrollPositionRestoration: 'enabled' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }