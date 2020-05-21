import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { environment } from 'src/environments/environment';
import { AuthNotLoginAdmin } from '../shared/guards/not-login-admin.guard';
import { RegisterComponent } from './register/register.component';
import { LoginedAuth } from '../shared/guards/logined.guard';
export const routes: Routes = [
    {
        path: '',
        // component: PrimaryLayoutComponent,
        children: [
            {
                path: `${environment.routerLoginAdmin}/login`,
                component: LoginComponent,
                canActivate: [AuthNotLoginAdmin]
            },
            {
                path: 'login',
                component: LoginComponent,
                canActivate: [AuthNotLoginAdmin]
            }
            // ,
            // {
            //     path: 'register/email',
            //     component: RegisterComponent,
            //     canActivate: [LoginedAuth]
            // }
        ],
    }
];

export const AuthRouting: ModuleWithProviders = RouterModule.forChild(routes);
