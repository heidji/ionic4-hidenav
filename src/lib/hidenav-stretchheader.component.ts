import {
    AfterViewInit,
    Component,
    ContentChild,
    ElementRef,
    OnInit,
    Input,
    EventEmitter,
    Output,
    ContentChildren,
    HostBinding
} from '@angular/core';
import {HidenavShService} from './hidenav-sh-service.service';

@Component({
    selector: 'hidenav-stretchheader',
    template: `
        <style>
            .overlay {
                position: absolute;
                height: inherit;
                width: inherit;
                z-index: 101;
                pointer-events: none;
                /*opacity: var(--opacity);*/
                background: var(--color);
                filter: opacity(0);
                --opacity: 0;
                --color: black;
            }

            :host {
                z-index: 1;
            }

            :host.md {
                -webkit-box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.53);
                -moz-box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.53);
                box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.53);
            }

            :host.ios {
                border-bottom: 1px solid #5a5e63;
            }
        </style>
        <div class="overlay"></div>
        <ng-content></ng-content>
    `
})
export class HidenavStretchheaderComponent implements OnInit, AfterViewInit {
    @ContentChild('shrinkexpand', {read: ElementRef}) header: ElementRef;
    @ContentChildren('static', {read: ElementRef}) static: any;
    @HostBinding('class') class: any;
    name: any;
    @Input('no-border') noBorder: string;
    @Input('header-height') headerHeight: any;
    @Input('init-expanded') initExpanded: any;
    @Input('opacity-color') opacityColor: any;
    @Input('opacity-factor') opacityFactor: any;
    @Input('preserve-header') preserveHeader: any;

    @Output() scroll: EventEmitter<number> = new EventEmitter<number>();

    constructor(public el: ElementRef, public globals: HidenavShService) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(() => {
                if(this.el.nativeElement.getAttribute('hidenav-sh-header').length > 0) {
                    this.name = this.el.nativeElement.getAttribute('hidenav-sh-header');
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
            this.globals.data[this.name].header = this.header;
            this.globals.data[this.name].static = this.static;
            this.globals.initiate(this.name);
            this.globals.scroll.subscribe(res => {
                if (res.name == this.name) {
                    this.scroll.emit(res.height);
                }
            });
            if (this.noBorder != 'true') {
                let mode = document.querySelector('html').getAttribute('mode');
                setTimeout(() => {
                    if (typeof this.class == 'undefined') {
                        this.class = mode;
                    } else {
                        this.class += ' ' + mode;
                    }
                }, 0);
            }
        }
    }

    expand(duration = 200) {
        this.globals.expand(this.name, duration);
    }

    shrink(duration = 200) {
        this.globals.shrink(this.name, duration);
    }

    toggle(duration = 200) {
        this.globals.toggle(this.name, duration);
    }

    ngOnDestroy() {
        if(this.name) {
            delete this.globals.data[this.name].header;
        }
    }

}
