'use strict';

export default class MyList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.count = 0;
    }

    init(link) {
        this.head = this.tail = link;
        this.count = 1;
    }

    add(link, toTail) {
        if (toTail === true) {
            this.tail.next = link;
            link.prev = this.tail;

            this.tail = link;
        } else {
            this.head.prev = link;
            link.next = this.head;

            this.head = link;
        }

        this.count++;
    }

    get Count() {
        return this.count
    };

    getCount() {
        let counter = 0;

        let link = this.head;

        while (link) {
            counter++;

            link = link.next;
        }

        return counter;
    }

    isEmpty = () => !this.head;

    toString0 = (coordIndex) => {
        let str = "";

        let link = this.head;

        while (link) {
            //str += (coordIndex 
            //? `${link.value.toString(coordIndex)}, `
            //: `${link.value.toString()}, `);
            str += `${link.value.toString0(coordIndex)} -> `;

            link = link.next;
        }

        str += "null";

        return str;       
    }
}