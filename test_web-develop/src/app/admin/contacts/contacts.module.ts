import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ContactsComponent } from './contacts.component';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutModule } from 'src/app/shared/layout/layout.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from 'src/app/shared/components/alert/alert.module';
import { DeleteComponent } from './delete/delete.component';
import { BlockComponent } from './block/block.component';
import { EditComponent } from './edit/edit.component';
import { ElementsModule } from 'src/app/shared/components/elements/elements.module';
import { ServiceModule } from 'src/app/shared/services/service.module';

const routes: Routes = [
    {
        path: '', component: ContactsComponent
    }
];
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        TranslateModule.forChild(),
        LayoutModule,
        FormsModule,
        ReactiveFormsModule,
        AlertModule,
        ElementsModule
    ],
    declarations: [
        ContactsComponent,
        DeleteComponent,
        BlockComponent,
        EditComponent,
    ]
})
export class ContactModule { }
