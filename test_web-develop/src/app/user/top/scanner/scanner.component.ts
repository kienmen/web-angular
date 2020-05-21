import { Component, VERSION, OnInit, ViewChild } from '@angular/core';


import { Result } from '@zxing/library';
import { ZXingScannerComponent } from '../modules/zxing-scanner/zxing-scanner.component';
import { TopService } from '../top.service';
import { ComponentActions } from 'src/app/shared/components/alert/component-actions';
import { Router } from '@angular/router';
import { Utils } from 'src/app/shared/enums/utils';
import { CrudType } from 'src/app/shared/enums/crud-type.enum';
declare var $: any;

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['../top.component.scss', './scanner.component.scss']
})


export class ScannerComponent implements OnInit {

  message = {
    title: '',
    message: '',
    mode: 0
  };

  scannerEnabled = true;

  @ViewChild('scanner', { static: false })
  scanner: ZXingScannerComponent;

  hasDevices: boolean;
  hasPermission: boolean;
  qrResultString: any;
  qrResult: Result;

  availableDevices: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo;
  constructor(private topService: TopService, private componentAction: ComponentActions, private router: Router) {

  }
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      this.hasDevices = true;
      this.availableDevices = devices;
      // selects the devices's back camera by default
      for (const device of devices) {
        if (/back|rear|environment/gi.test(device.label)) {
          this.scanner.changeDevice(device);
          this.currentDevice = device;
          break;
        }
      }

      this.currentDevice = this.availableDevices[0];
    });

    this.scanner.camerasNotFound.subscribe(() => this.hasDevices = false);
    this.scanner.scanComplete.subscribe((result: Result) => this.qrResult = result);
    this.scanner.permissionResponse.subscribe((perm: boolean) => this.hasPermission = perm);
  }
  displayCameras(cameras: MediaDeviceInfo[]) {
    this.availableDevices = cameras;
  }

  handleQrCodeResult(resultString: string) {
    // well-to:dfsdfdsfdsfdsfdsf
    this.qrResultString = resultString.split(':');
    if (this.qrResultString && this.qrResultString[0]  === 'well-chat' ) {
      this.scannerEnabled = false;
      this.componentAction.showLoading();
      this.topService.scanQr(this.qrResultString[1]).subscribe(
        res => {
          this.router.navigate(['/dashboard/info'], { queryParams: { id: this.qrResultString[1] } });
          this.componentAction.hideLoading();
        },
        err => {
          this.showPopUp(Utils.TITLE_ERROR, 'SCANNER.ROOM_NOT_FOUND', CrudType.CANCEL);
          this.componentAction.hideLoading();
        }
      );
    }
  }

  onDeviceSelectChange(selectedValue: string) {
    this.currentDevice = this.scanner.getDeviceById(selectedValue);
  }

  stateToEmoji(state: boolean): string {

    const states = {
      // not checked
      undefined: '?',
      // failed to check
      null: 'O',
      // success
      true: '✔',
      // can't touch that
      false: 'X'
    };

    return states['' + state];
  }

  saveConfirm() {
    $('#alert-scanner').modal('hide');
     this.scannerEnabled = true;
    if (this.message.mode === CrudType.CANCEL) {
      this.scannerEnabled = true;
    }
  }

  showPopUp(title, message, mode) {
    this.message.title = title;
    this.message.message = message;
    this.message.mode = mode;
    $('#alert-scanner').modal('show');
  }
}