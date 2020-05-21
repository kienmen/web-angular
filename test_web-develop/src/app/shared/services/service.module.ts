import { NgModule } from '@angular/core';
import { BaseService } from './helpers/base.service';
import { TimeService } from './helpers/time.service';
import { UploadFileService } from './helpers/upload-file.service';
import { PagerService } from './helpers/pager.service';
import { EncodeDecodeService } from './helpers/encode-decode.service';
import { UserService } from './user/user.service';
import { HttpClientModule } from '@angular/common/http';
import { StorageService } from './user/storageService';
import { HttpModule } from '@angular/http';
import { ValidationService } from './helpers/validation.service';
import { LangService } from './user/lang.service';
@NgModule({
    imports: [
        HttpClientModule,
        HttpModule,
    ],
    declarations: [
    ],
    exports: [
    ],
    providers: [
        BaseService,
        TimeService,
        UploadFileService,
        PagerService,
        EncodeDecodeService,
        UserService,
        StorageService,
        ValidationService
    ]
})
export class ServiceModule { }
