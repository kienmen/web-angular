import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from 'src/app/shared/layout/layout.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { MainLayoutComponent } from '../shared/layout/main-layout/main-layout.component';
import { UserGuard } from '../shared/guards/auth.guard';
import { MainService } from './main.service';
import { SocketService } from './top/socket.service';
const routes: Routes = [
    {
        path: '',
        loadChildren: './top/top.module#TopModule'
    },
    {
        path: 'dashboard',
        component: MainLayoutComponent,
        loadChildren: './group/group.module#GroupModule',
        canActivate: [UserGuard]
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
    ],
    providers: [
        MainService,
        SocketService
    ]
})
export class UserModule { }
