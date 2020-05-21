import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { GroupComponent } from './group.component';
import { AlertModule } from 'src/app/shared/components/alert/alert.module';
import { ElementsModule } from 'src/app/shared/components/elements/elements.module';
import { ServiceModule } from 'src/app/shared/services/service.module';
import { InfoGroupComponent } from './info-group/info-group.component';
const routes: Routes = [
    {
        path: '',
        component: GroupComponent
    }
    ,
    {
        path: 'info',
        component: InfoGroupComponent
    }
];
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        TranslateModule.forChild(),
        AlertModule,
        ElementsModule,
        ServiceModule
    ],
    declarations: [
        GroupComponent,
        InfoGroupComponent
    ]
})
export class GroupModule { }
