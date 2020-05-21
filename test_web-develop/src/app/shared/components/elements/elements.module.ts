import { NgModule } from '@angular/core';
import { CommonModule, SlicePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ItemMessageComponent } from './item-message/item-message.component';
import { ItemGroupUserComponent } from './item-group-user/item-group-user.component';
import { InfoMemberComponent } from './info-member/info-member.component';
import { TimePipe } from './pipe/time.pipe';
import { LinkPipe } from './pipe/link.pipe';
import { SlideTextPipe } from './pipe/slidetext.pipe';
import { ReplyMessageComponent } from './reply-message/reply-message.component';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild()
    ],
    declarations: [
        ItemMessageComponent,
        ItemGroupUserComponent,
        InfoMemberComponent,
        TimePipe,
        LinkPipe,
        SlideTextPipe,
        ReplyMessageComponent
    ],
    exports: [
        ItemMessageComponent,
        ItemGroupUserComponent,
        InfoMemberComponent,
        ReplyMessageComponent
    ]
})
export class ElementsModule { }
