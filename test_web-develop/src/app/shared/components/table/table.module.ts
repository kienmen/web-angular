import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from './data-table/data-table.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { ModelSearchComponent } from './model-search/model-search.component';
import { SelectDropdownComponent } from './select-dropdown/select-dropdown.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild()

    ],
    declarations: [
        DataTableComponent,
        DatePickerComponent,
        ModelSearchComponent,
        SelectDropdownComponent
    ],
    exports: [
        DataTableComponent,
        DatePickerComponent,
        ModelSearchComponent,
        SelectDropdownComponent
    ]
})
export class TableModule { }
