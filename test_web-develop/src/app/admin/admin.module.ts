import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PrimaryLayoutComponent } from 'src/app/shared/layout/primary-layout/primary-layout.component';
import { LayoutModule } from 'src/app/shared/layout/layout.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { AdminGuard } from '../shared/guards/auth-admin.guard';
const routes: Routes = [
    {
        path: '',
        component: PrimaryLayoutComponent,
        loadChildren: './contacts/contacts.module#ContactModule',
        canActivate: [AdminGuard]
    }
];
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        TranslateModule.forChild(),
        LayoutModule,
        FormsModule,
    ],
    declarations: [
    ]
})
export class AdminModule { }
