import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimaryLayoutComponent } from './primary-layout/primary-layout.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';

import { RouterModule } from '@angular/router';
import { FooterComponent } from '../core/footer/footer.component';
import { SideNavComponent } from '../core/side-nav/side-nav.component';
import { HeaderComponent } from '../core/header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderUserComponent } from '../core/header-user/header-user.component';


@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule.forChild()
    ],
    declarations: [
        PrimaryLayoutComponent,
        MainLayoutComponent,
        FooterComponent,
        HeaderComponent,
        SideNavComponent,
        HeaderUserComponent
    ],
    exports: [
        PrimaryLayoutComponent,
        MainLayoutComponent,
        FooterComponent,
        HeaderComponent,
        SideNavComponent,
        HeaderUserComponent
    ]
})
export class LayoutModule { }
