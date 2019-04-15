import {Directive, ElementRef} from '@angular/core';
import {HidenavService} from './hidenav-service.service';

@Directive({
  selector: '[hidenav-header]'
})
export class HidenavHeaderDirective {

    name: any;

    constructor( public el: ElementRef, private globals: HidenavService) {

    }

    ngAfterViewInit() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(() => {
                if(this.el.nativeElement.getAttribute('hidenav-header').length > 0) {
                    this.name = this.el.nativeElement.getAttribute('hidenav-header');
                    this.start();
                    observer.disconnect();
                }
            });
        });
        observer.observe(this.el.nativeElement, {
            attributes: true,
        });
    }

    start() {
        if(this.name) {
            if (typeof this.globals.data[this.name] == 'undefined' || this.globals.data[this.name] == null)
                this.globals.data[this.name] = [];
            if (this.globals.data[this.name].header != null)
                return false;
            this.globals.data[this.name].header = this.el;
            this.globals.initiate(this.name);
        }
    }

    ngOnDestroy() {
        if(this.name) {
            delete this.globals.data[this.name].header;
        }
    }

}
