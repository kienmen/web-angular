import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRouting, routes } from './auth.routing';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LayoutModule } from 'src/app/shared/layout/layout.module';
import { ServiceModule } from 'src/app/shared/services/service.module';
import { AlertModule } from 'src/app/shared/components/alert/alert.module';

@NgModule({
    imports: [
        CommonModule,
        AuthRouting,
        LayoutModule,
        TranslateModule.forChild(),
        ReactiveFormsModule,
        FormsModule,
        ServiceModule,
        AlertModule,
        RouterModule,
    ],
    declarations: [
        RegisterComponent,
        LoginComponent
    ]
})
export class AuthModule { }
