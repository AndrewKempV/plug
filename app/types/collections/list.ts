import {
  Group,
  ITEM_NOT_FOUND_MSG,
  MULTIPLE_INSTANCES_FOUND_MSG,
  objCompare
} from "./common";
import { IComparer, IEnumerable, IEqualityComparer } from "./interfaces";

export interface IList<T> extends IEnumerable<T> {
  add(item: T): void;
  addRange(items: T[]): void;
  remove(predicate: (item: T) => boolean): void;
  clear(): void;
}

export class List<T> implements IList<T> {
  private list: T[] = new Array<T>();

  constructor(array: T[] = []) {
    if (array) {
      this.list = array;
    }
  }

  /* IList */

  public add(item: T): void {
    this.list.push(item);
  }

  public addRange(items: T[]): void {
    items.forEach(x => this.add(x));
  }

  public remove(predicate: (item: T) => boolean): void {
    const temp = new Array<T>();
    this.list.forEach(element => {
      if (!predicate(element)) {
        temp.push(element);
      }
    });

    this.list = temp;
  }

  public clear(): void {
    this.list = new Array<T>();
  }

  /* IEnumerable */

  public asEnumerable(): IEnumerable<T> {
    return this;
  }

  get length(): number {
    return this.list.length;
  }

  public elementAt(index: number): T {
    try {
      return this.list[index];
    } catch (e) {
      throw new Error(e);
    }
  }

  public any(predicate?: (item: T) => boolean): boolean {
    if (!predicate) {
      return this.list.length > 0;
    }
    for (const element of this.list) {
      if (predicate(element)) {
        return true;
      }
    }
    return false;
  }

  public all(predicate?: (item: T) => boolean): boolean {
    if (!predicate) {
      return this.list.length > 0;
    }

    for (const element of this.list) {
      if (!predicate(element)) {
        return false;
      }
    }
    return true;
  }

  public single(predicate?: (item: T) => boolean): T {
    if (this.list.length <= 0) {
      throw ITEM_NOT_FOUND_MSG;
    }

    if (predicate) {
      const item = this.singleOrDefault(predicate);

      if (!item) {
        throw ITEM_NOT_FOUND_MSG;
      }

      return item;
    }

    return this.list[0];
  }

  public first(predicate?: (item: T) => boolean): T {
    if (this.list.length <= 0) {
      throw ITEM_NOT_FOUND_MSG;
    }

    if (predicate) {
      const item = this.firstOrDefault(predicate);

      if (!item) {
        throw ITEM_NOT_FOUND_MSG;
      }

      return item;
    }

    return this.list[0];
  }

  public last(predicate?: (item: T) => boolean): T {
    if (this.list.length <= 0) {
      throw ITEM_NOT_FOUND_MSG;
    }

    if (predicate) {
      const item = this.lastOrDefault(predicate);

      if (!item) {
        throw ITEM_NOT_FOUND_MSG;
      }

      return item;
    }

    return this.list[this.list.length - 1];
  }

  public singleOrDefault(predicate: (item: T) => boolean): T | null {
    const temp = new Array<T>();

    this.list.filter(element => {
      if (predicate(element)) {
        temp.push(element);
      }
    });

    if (temp.length > 1) {
      throw MULTIPLE_INSTANCES_FOUND_MSG;
    }

    if (temp.length <= 0) {
      return null;
      // throw new Error('Cannot get single from empty list');
    }

    return temp[0];
  }

  public firstOrDefault(predicate: (item: T) => boolean): T | null {
    for (let i = 0; i < this.length; i++) {
      const item = this.list[i];
      if (predicate(item)) {
        return item;
      }
    }

    return null;
  }

  public lastOrDefault(predicate: (item: T) => boolean): T | null {
    for (let i = this.length; i >= 0; i--) {
      const item = this.list[i - 1];
      if (predicate(item)) {
        return item;
      }
    }

    return null;
  }

  public where(predicate: (item: T) => boolean): IEnumerable<T> {
    const temp = new List<T>();

    this.list.filter(element => {
      if (predicate(element)) {
        temp.add(element);
      }
    });

    return temp;
  }

  public select<TResult>(
    predicate: (item: T) => TResult
  ): IEnumerable<TResult> {
    const temp = new List<TResult>();
    this.forEach(x => temp.add(predicate(x)));
    return temp;
  }

  public forEach(predicate: (item: T) => void): void {
    this.list.forEach(x => predicate(x));
  }

  public toArray(): T[] {
    return this.list;
  }

  public join<TOuter, TMatch, TResult>(
    outer: IEnumerable<TOuter>,
    conditionInner: (item: T) => TMatch,
    conditionOuter: (item: TOuter) => TMatch,
    select: (x: T, y?: TOuter) => TResult,
    leftJoin: boolean = false
  ): IEnumerable<TResult> {
    const resultList = new List<TResult>();
    this.list.forEach(x => {
      const outerEntries = outer
        .toArray()
        .filter(y => conditionInner(x) === conditionOuter(y));
      if (leftJoin && outerEntries && outerEntries.length <= 0) {
        resultList.add(select(x));
      } else {
        outerEntries.forEach(z => resultList.add(select(x, z)));
      }
    });

    return resultList;
  }

  public groupBy(predicate: (item: T) => any[]): IEnumerable<Group<T>> {
    const groups: { [key: string]: T[] } = {};
    this.list.forEach(element => {
      const group = JSON.stringify(predicate(element));
      groups[group] = groups[group] || [];
      groups[group].push(element);
    });
    const g = Object.keys(groups).map(group => {
      const a = group.substr(1, group.length - 2);
      const grp = new Group<T>(a.split(","), groups[group]);
      return grp;
    });

    return new List<Group<T>>(g);
  }

  public orderBy(comparer: IComparer<T>): IEnumerable<T> {
    const temp = this.list.sort((x, y) => comparer.compare(x, y));
    return new List<T>(temp);
  }

  public union(list: IEnumerable<T>): IEnumerable<T> {
    this.addRange(list.toArray());
    return this;
  }

  public distinct(comparer: IEqualityComparer<T>): IEnumerable<T> {
    const uniques = new List<T>();
    this.forEach(x => {
      uniques.forEach(y => {
        if (!comparer.equals(x, y)) {
          uniques.add(x);
        }
      });
    });

    return uniques;
  }

  public skip(no: number): IEnumerable<T> {
    if (no > 0) {
      return new List(this.list.slice(no, this.list.length - 1));
    }

    return this;
  }

  public take(no: number): IEnumerable<T> {
    if (no > 0) {
      return new List(this.list.slice(0, no));
    }
    return this;
  }

  public sum(predicate: (item: T) => number): number {
    let sum = 0;
    this.list.forEach(x => (sum = sum + predicate(x)));

    return sum;
  }

  public avg(predicate: (item: T) => number): number {
    return this.sum(predicate) / this.length;
  }

  public min(predicate: (item: T) => number): number {
    let min = 0;
    this.list.forEach((x, index) => {
      if (index === 0) {
        min = predicate(x);
      } else {
        const val = predicate(x);
        if (val < min) {
          min = val;
        }
      }
    });

    return min;
  }

  public max(predicate: (item: T) => number): number {
    let max = 0;
    this.list.forEach((x, index) => {
      if (index === 0) {
        max = predicate(x);
      } else {
        const val = predicate(x);
        if (val > max) {
          max = val;
        }
      }
    });

    return max;
  }

  public count(predicate: (item: T) => boolean): number {
    if (!predicate) {
      return this.length;
    }
    let count = 0;
    this.list.forEach(x => {
      if (predicate(x)) {
        count++;
      }
    });

    return count;
  }
}
