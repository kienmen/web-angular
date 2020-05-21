import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelRemarkComponent } from './model-remark/model-remark.component';
import { ModelContainerViewComponent } from './model-container-view/model-container-view.component';
import { LoadingComponent } from './loading/loading.component';
import { AlertConfirmComponent } from './alert-confirm/alert-confirm.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentActions } from './component-actions';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule.forChild()
    ],
    declarations: [
        ModelRemarkComponent,
        ModelContainerViewComponent,
        LoadingComponent,
        AlertConfirmComponent
    ],
    exports: [
        ModelRemarkComponent,
        ModelContainerViewComponent,
        LoadingComponent,
        AlertConfirmComponent
    ],
    providers: [
        ComponentActions
    ]
})
export class AlertModule { }
