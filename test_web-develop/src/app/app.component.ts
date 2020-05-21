import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './shared/services/user/storageService';
import { LangService } from './shared/services/user/lang.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor(private translateService: TranslateService, private storageService: StorageService, private langService: LangService) {
  }

  ngOnInit(): void {
    this.langService.lang$.subscribe(
      res => {
        this.setLang(res);
      }
    );
  }

  setLang(res) {
    this.storageService.setLang(res);
    this.translateService.setDefaultLang(this.storageService.getLang() || 'ja');
  }
}
