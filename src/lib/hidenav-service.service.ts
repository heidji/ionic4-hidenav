import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class HidenavService {

    data = [];
    names = [];
    tabnames = [];

    constructor() {
    }

    requestName(){
        let name = 'page'+this.names.length;
        this.names.push(name);
        return name;
    }

    requestTabName(name){
        if(!this.tabnames[name])
            this.tabnames[name] = [];
        let tabname = name+'tab'+this.tabnames[name].length;
        this.tabnames[name].push(tabname);
        return tabname;
    }

    initiate(name) {
        let names = [];
        for (let key in this.data) {
            if (this.data[key].parent == name)
                names.push(key);
        }
        for (let name of names) {
            this.initiate2(name);
        }
        if (names.length == 0)
            this.initiate2(name);
    }

    initiate2(name) {
        if (!(this.data[name] && (this.data[name].parent && this.data[this.data[name].parent].tabscontent && this.data[name].content && this.data[this.data[name].parent].header) || (!this.data[name].parent && this.data[name].content && this.data[name].header)))
            return false;
        let parent = this.data[name].parent;
        let content = this.data[name].content;
        let contentElem = this.data[name].contentElem;
        if (this.data[name].scrollTop == null)
            this.data[name].scrollTop = 0;
        if (this.data[name].lastscroll == null)
            this.data[name].lastscroll = 0;
        if (this.data[name].direction == null)
            this.data[name].direction = '';
        if (this.data[name].tapping == null)
            this.data[name].tapping = false;
        content.scrollEvents = true;
        if (!parent) {
            let header = this.data[name].header;
            setTimeout(() => {
                this.data[name].navheight = this.data[name].header.nativeElement.offsetHeight;
                let scrollContent: any = contentElem.nativeElement.shadowRoot.querySelector('.inner-scroll');
                this.data[name].paddingTop = parseInt(window.getComputedStyle(scrollContent)['padding-top'], 10);
                content.ionScroll.subscribe((e) => {
                    if(e.detail.scrollTop == 0){
                        scrollContent.style.top = null;
                        scrollContent.style.paddingTop = this.data[name].paddingTop + 'px';
                    }else{
                        scrollContent.style.top = '-' + this.data[name].navheight + 'px';
                        scrollContent.style.paddingTop = this.data[name].paddingTop + this.data[name].navheight + 'px';
                    }
                    if (scrollContent.scrollHeight > (scrollContent.clientHeight + 100)) {
                        this.data[name].scrolling = true;
                        let x = this.data[name].lastscroll - e.detail.scrollTop;
                        this.data[name].direction = x > 0 ? 'up' : 'down';
                        this.data[name].lastscroll = e.detail.scrollTop;
                        this.data[name].scrollTop = this.data[name].scrollTop - x;
                        if (this.data[name].scrollTop > this.data[name].navheight)
                            this.data[name].scrollTop = this.data[name].navheight;
                        if (this.data[name].scrollTop < 0)
                            this.data[name].scrollTop = 0;
                        header.nativeElement.style.transform = 'translate3d(0, ' + -this.data[name].scrollTop + 'px, 0)';
                    }
                });
                content.ionScrollEnd.subscribe(() => {
                    setTimeout(() => {
                        //catch the last tick
                        if (scrollContent.scrollTop == 0) {
                            scrollContent.style.top = null;
                            scrollContent.style.paddingTop = this.data[name].paddingTop + 'px';
                        }
                        this.data[name].scrolling = false;
                        this.c(name);
                    }, 10)
                });
            }, 100);
            contentElem.nativeElement.addEventListener('touchend', () => {
                this.data[name].tapping = false;
                this.c(name);
            });
            contentElem.nativeElement.addEventListener('touchstart', () => this.data[name].tapping = true);
        } else if (parent) {
            let header = this.data[parent].header;
            let tabscontentElem = this.data[parent].tabscontentElem;
            let supertabsToolbar: any = tabscontentElem.nativeElement.querySelector('super-tabs-toolbar');
            setTimeout(() => {
                this.data[parent].tabscontentHeight = tabscontentElem.nativeElement.scrollHeight;
                let scrollContent: any = contentElem.nativeElement.shadowRoot.querySelector('.inner-scroll');
                let tabsscrollContent: any = this.data[parent].tabscontentElem.nativeElement.shadowRoot.querySelector('.inner-scroll');
                if (scrollContent.scrollHeight > (scrollContent.clientHeight + 100)) {
                    this.data[name].navheight = this.data[parent].header.nativeElement.offsetHeight;
                    this.data[name].paddingTop = parseInt(window.getComputedStyle(scrollContent)['padding-top'], 10);
                }
                content.ionScroll.subscribe((e) => {
                    if (this.data[name].tapping && scrollContent.scrollHeight > (scrollContent.clientHeight + 100)) {
                        if (e.detail.scrollTop == 0) {
                            supertabsToolbar.style.position = 'static';
                            scrollContent.style.paddingTop = this.data[name].paddingTop + 'px';
                            tabscontentElem.nativeElement.style.top = null;
                            tabsscrollContent.style.height = this.data[parent].tabscontentHeight + 'px';
                            tabscontentElem.nativeElement.style.top = null;
                        } else {
                            let s = e.detail.scrollTop;
                            supertabsToolbar.style.position = 'absolute';
                            supertabsToolbar.style.top = this.data[name].navheight + 'px';
                            tabsscrollContent.style.height = (this.data[parent].tabscontentHeight + this.data[name].navheight) + 'px';
                            tabscontentElem.nativeElement.style.top = '-' + this.data[name].navheight + 'px';
                            scrollContent.style.paddingTop = this.data[name].paddingTop + supertabsToolbar.clientHeight + this.data[name].navheight + 'px';
                            scrollContent.scrollTop = s;
                        }
                    }
                    this.data[name].scrolling = true;
                    let x = this.data[name].lastscroll - e.detail.scrollTop;
                    this.data[name].direction = x > 0 ? 'up' : 'down';
                    this.data[name].lastscroll = e.detail.scrollTop;
                    this.data[name].scrollTop = this.data[name].scrollTop - x;
                    if (this.data[name].scrollTop > this.data[name].navheight)
                        this.data[name].scrollTop = this.data[name].navheight;
                    if (this.data[name].scrollTop < 0)
                        this.data[name].scrollTop = 0;
                    header.nativeElement.style.transform = 'translate3d(0, ' + -this.data[name].scrollTop + 'px, 0)';
                    supertabsToolbar.style.transform = 'translate3d(0, ' + -this.data[name].scrollTop + 'px, 0)';
                });
                content.ionScrollEnd.subscribe(() => {
                    setTimeout(() => {
                        //catch the last tick
                        if (scrollContent.scrollTop == 0) {
                            supertabsToolbar.style.position = 'static';
                            scrollContent.style.paddingTop = this.data[name].paddingTop + 'px';
                            tabscontentElem.nativeElement.style.top = null;
                            tabsscrollContent.style.height = this.data[parent].tabscontentHeight + 'px';
                            tabscontentElem.nativeElement.style.top = null;
                        }
                        this.data[name].scrolling = false;
                        this.c(name);
                    }, 10)
                });
            }, 100);
            contentElem.nativeElement.addEventListener('touchend', () => {
                this.data[name].tapping = false;
                this.c(name);
            });
            contentElem.nativeElement.addEventListener('touchstart', () => this.data[name].tapping = true);
        }
    }

    private c(name) {
        if (this.data[name].tapping || this.data[name].scrolling)
            return false;
        if (this.data[name].scrollTop == 0 || this.data[name].scrollTop == this.data[name].navheight)
            return false;
        let content = this.data[name].content;
        let scrollTopTemp = this.data[name].scrollTop;
        if (this.data[name].direction == 'down') {
            if (this.data[name].scrollTop < this.data[name].navheight) {
                content.scrollByPoint(0, (this.data[name].navheight - scrollTopTemp), (this.data[name].navheight - scrollTopTemp) * 6);
            }
        } else if (this.data[name].direction == 'up') {
            if (this.data[name].scrollTop < this.data[name].navheight) {
                content.scrollByPoint(0, -scrollTopTemp, scrollTopTemp * 6);
            }
        }
    }

    resetTabs(parent, name) {
        let header = this.data[parent].header;
        let tabscontentElem = this.data[parent].tabscontentElem;
        let supertabsToolbar: any = tabscontentElem.nativeElement.querySelector('super-tabs-toolbar');
        let tabsscrollContent: any = this.data[parent].tabscontentElem.nativeElement.shadowRoot.querySelector('.inner-scroll');
        let scrollContent: any = this.data[name].contentElem.nativeElement.shadowRoot.querySelector('.inner-scroll');
        scrollContent.scrollTop = scrollContent.scrollTop - this.data[name].scrollTop;
        setTimeout(() => {
            if (scrollContent.scrollTop == 0) {
                supertabsToolbar.style.position = 'static';
                scrollContent.style.paddingTop = this.data[name].paddingTop + 'px';
                tabscontentElem.nativeElement.style.top = null;
                tabsscrollContent.style.height = this.data[parent].tabscontentHeight + 'px';
                tabscontentElem.nativeElement.style.top = null;
            } else {
                let s = scrollContent.scrollTop;
                supertabsToolbar.style.position = 'absolute';
                supertabsToolbar.style.top = this.data[name].navheight + 'px';
                tabsscrollContent.style.height = (this.data[parent].tabscontentHeight + this.data[name].navheight) + 'px';
                tabscontentElem.nativeElement.style.top = '-' + this.data[name].navheight + 'px';
                scrollContent.style.paddingTop = this.data[name].paddingTop + supertabsToolbar.clientHeight + this.data[name].navheight + 'px';
                scrollContent.scrollTop = s;
            }
            header.nativeElement.style.transform = null;
            supertabsToolbar.style.transform = null;
        }, 20);

    }
}
