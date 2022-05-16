'use strict';

export default class Link {
    constructor(val) {
        this.value = val;
        this.next = null;
        this.prev = null;
    }

    insert(link, toNext) {
        if (toNext === true) {
            if (this.next)
                this.next.prev = link;

            link.next = this.next;
            link.prev = this;

            this.next = link;
        } else {
            if (this.prev)
                this.prev.next = link;

            link.prev = this.prev;
            link.next = this;

            this.prev = link;
        }
    }
}