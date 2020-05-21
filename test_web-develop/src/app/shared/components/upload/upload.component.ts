import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UUID } from 'angular2-uuid';
declare var $: any;

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  @Output() changeImage = new EventEmitter();
  @Input() isDisable: boolean;
  @Input() messageError: string;
  @Input() urlImage: string;

  fileUpload: string;
  text: string;
  background: string;
  formUpload: string;
  error: string;
  constructor() {
    this.fileUpload = UUID.UUID();
    this.text = UUID.UUID();
    this.background = UUID.UUID();
    this.formUpload = UUID.UUID();
    this.error = UUID.UUID();
  }

  ngOnChanges(change) {
    this.show_error(this.messageError);
    this.setImageUrl(this.urlImage);
  }

  setImageUrl(url) {
    if (!url) {
      return;
    }
    let img = document.createElement("img");
    let background = $('#' + this.background);
    $('#' + this.text).hide();
    img.setAttribute("src", url);
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.maxHeight = "250px";
    background.html(img);
    background.show();
  }

  ngOnInit() {
  }

  upload() {
    if (this.isDisable)
      return;
    // $('#' + this.error).hide();
    $("#" + this.fileUpload).click();
    this.changeImage.emit({ file: '' })
  }

  on_change() {
    let file = this.get_file();
    let background = $('#' + this.background);
    let text = $('#' + this.text);
    background.hide();
    text.hide();
    if (file) {
      this.setImageFile(file);
      this.changeImage.emit({ file: file })
    }
    else {
      this.changeImage.emit({ file: '' })
      text.show();
    }
  }
  get_file() {
    let files = $("#" + this.fileUpload).prop('files');
    let isVisible = $("#" + this.formUpload).is(":visible");
    if (!isVisible)
      return false;
    else if (files && files[0])
      return this.validate_file(files[0]);
    else
      return null;
  }

  setImageFile(file) {
    let img = document.createElement("img");
    let reader = new FileReader();
    let background = $('#' + this.background);
    $('#' + this.text).hide();
    reader.onloadend = function () {
      img.src = reader.result as string;
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.maxHeight = "250px";
    }
    reader.readAsDataURL(file);
    background.html(img);
    background.show();
  }

  validate_file(file) {
    let name = file.name.toLowerCase();
    let extension = name.substring(name.lastIndexOf('.') + 1);
    let allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    let maxSizeMegabyte = 2;
    let maxSizeByte = maxSizeMegabyte * 1048576;
    if ($.inArray(extension, allowedExtensions) == -1) {
      this.show_error("Only these file types are accepted: " + allowedExtensions.join(', '));
    }
    else if (file.size > maxSizeByte) {
      this.show_error("File must be select < " + maxSizeMegabyte + " MB!");
    }
    else {
      return file;
    }
    return null;
  }

  show_error(message) {
    let error = $('#' + this.error);
    error.hide();
    error.text(message ? message : '');
    error.fadeIn(500);
  }

  on_click(){
    let file = this.get_file();
    if(file != null ){
      let background = $('#' + this.background);
      let text = $('#' + this.text);
      background.hide();
      text.show();
    }
  }
}
