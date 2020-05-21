import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { PageErrorComponent } from './page-error/page-error.component';
import { environment } from 'src/environments/environment';

export const APP_ROUTES: Routes = [
    {
        path: `${environment.routerLoginAdmin}`,
        loadChildren: './admin/admin.module#AdminModule'
    },
    {
        path: '',
        loadChildren: './user/user.module#UserModule',
    },
    {
        path: '',
        loadChildren: './auth/auth.module#AuthModule',
    },
    {
        path: '**',
        component: PageErrorComponent,
    }
];
export const Routing: ModuleWithProviders = RouterModule.forRoot(APP_ROUTES);
