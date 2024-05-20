/* eslint-disable lines-between-class-members */
/* eslint-disable no-use-before-define */
/* eslint-disable guard-for-in */
export class RecursiveClass {
  a: 'a';
  r: RecursiveClass;
  constructor() {
    this.a = 'a';
    this.r = this;
  }
}
