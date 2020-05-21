import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TopComponent } from './top.component';
import { RegisterTeleComponent } from './register-tele/register-tele.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { ScannerComponent } from './scanner/scanner.component';
import { ZXingScannerModule } from './modules/zxing-scanner/zxing-scanner.module';
import { TopService } from './top.service';
import { AlertModule } from 'src/app/shared/components/alert/alert.module';
import { UserGuard } from 'src/app/shared/guards/auth.guard';
import { RegisterGuard } from 'src/app/shared/guards/register-email.guard';
const routes: Routes = [
    {
        path: '',
        component: TopComponent,
        children: [
            {
                path: '',
                component: HomeComponent
            },
            {
                path: 'scanner',
                component: ScannerComponent,
                canActivate:  [UserGuard]
            }
        ]
    }
];
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        TranslateModule.forChild(),
        FormsModule,
        ReactiveFormsModule,
        ZXingScannerModule,
        AlertModule
    ],
    declarations: [
        TopComponent,
        RegisterTeleComponent,
        HomeComponent,
        ScannerComponent
    ],
    providers: [
        TopService
    ]
})
export class TopModule { }
