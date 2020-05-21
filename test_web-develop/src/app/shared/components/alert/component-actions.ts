import { Injectable } from "@angular/core";
declare var $: any;

@Injectable()
export class ComponentActions {
    componentsElement: any;

    componentDisplay = {
        header: true,
        footer: true,
        menu: true
    };

    constructor() {}

    setComponent(className, isDisplay) {
        this.componentDisplay[className] = isDisplay;
    }

    resetComponent() {
        this.componentDisplay = {
            header: true,
            footer: true,
            menu: true
        };
    }

    addCss(className, classAdd) {
        let element = $("." + className);
        if (!element.hasClass(classAdd)) element.addClass(classAdd);
    }

    removeCss(className) {
        $("." + className).removeClass(className);
    }

    showLoading() {
        $('.overlay').show();
    }

    hideLoading() {
        $('.overlay').hide();
    }
}
