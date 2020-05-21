import { Component, OnInit, Input, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { UUID } from 'angular2-uuid';
import * as moment from 'moment';
import { TimeService } from '../../../services/helpers/time.service';
declare var $: any;
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DatePickerComponent implements OnInit {
  @Input() currentTime;
  @Input() startTime;
  @Input() endTime;
  @Input() idInput;
  @Output() changeTime = new EventEmitter();
  wrongFormat = false;
  messageError = "Invalid date format, please key in date in format dd/mm/yyyy";
  uniqueId: string;

  constructor(private timeService: TimeService, public router:Router) {
    this.uniqueId = UUID.UUID();
  }

  ngOnInit() {
    this.initpicker();
  }

  ngOnChanges(change) {
    this.initpicker();
  }

  showCalendar() {
    let datepicker = $(".datepicker");
    let self = this;
    if (!datepicker.hasClass("new"))
    {
      $(".datepicker").click(function(){
        let day =  $(".datepicker-days .active.day").text();
        let year =  $(".datepicker-days .datepicker-switch").text();
        let date = new Date(day + year);
        let dateString = self.convertDate(date);
        $("#" + self.uniqueId + " .form-control").val(dateString);
        self.emitData(dateString);
      });

      $("body").click(function(event){
        if (!$(event.target).hasClass("datepicker") && !$(event.target).hasClass("click_time")) 
        {
          datepicker.hide();
          datepicker.removeClass("datepicker_show");
        }
      });
      datepicker.addClass("new");
    }
    datepicker.removeClass("datepicker-inline");
    if(datepicker.hasClass("datepicker_show")){
      datepicker.hide();
      datepicker.removeClass("datepicker_show");
    }
    else {
      datepicker.show();
      datepicker.addClass("datepicker_show");
    }
  }
  convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat);
    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
  }
  checkDateFormat(event, id) {
    this.currentTime = event;
    this.emitData(event);
  }

  initpicker() {
    let self = this;
    setTimeout(function () {

    let st = self.startTime ? self.startTime : self.timeService.MIN_TIME;
    let et = self.endTime ? self.endTime : self.timeService.MAX_TIME
    $('#' + self.uniqueId + '.form_date').datepicker({
      format: 'dd/mm/yyyy',
      todayHighlight: true,
      keyboardNavigation: true,
      autoclose: true,
      startView: 3,
      ignoreReadonly: true,
      startDate: self.timeService.getTimeFromTimeFormat(st, self.timeService.DATE_FORMAT).toDate(),
      endDate: self.timeService.getTimeFromTimeFormat(et, self.timeService.DATE_FORMAT).toDate(),

    }).on('change', function (e) {
      if (e.target.value) {
        self.emitData(e.target.value)
      }else {
        // if(e.target.value == ""){
        //   this.wrongFormat = true;
        //   this.messageError = 'dm ra di'; 
        //   console.log(this.messageError, this.wrongFormat);   
        // }      
      }
    })

    $('#' + self.uniqueId).click(function () {
      $("#datePickerID").blur(function () {
        self.emitData($(this).val())
      });
    })

    $('#' + self.uniqueId).datepicker('setStartDate', self.timeService.getTimeFromTimeFormat(st, self.timeService.DATE_FORMAT).toDate());
    $('#' + self.uniqueId).datepicker('setEndDate', self.timeService.getTimeFromTimeFormat(et, self.timeService.DATE_FORMAT).toDate());
    });
  }

  emitData(time) {
    this.wrongFormat = false;

    if (!time) {
      this.changeTime.emit({
        value: time
      })
      return;
    }

   
    this.wrongFormat = !moment(time, this.timeService.DATE_FORMAT, true).isValid();
    if (this.wrongFormat) {
      this.messageError = 'Invalid date format, please key in date in format dd/mm/yyyy'
      this.wrongFormat = true;
    } else if (this.startTime && this.timeService.compareTwoDate(this.startTime, time) > 0) {
      this.messageError = 'Invalid Date'
      this.wrongFormat = true;
    } else if (this.endTime && this.timeService.compareTwoDate(time, this.endTime) > 0) {
      this.messageError = 'Invalid Date'
      this.wrongFormat = true;
    } else {
      this.changeTime.emit({
        value: time
      })
    }
  }
}