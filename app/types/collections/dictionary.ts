import {
  Group,
  ITEM_NOT_FOUND_MSG,
  MULTIPLE_INSTANCES_FOUND_MSG,
  objCompare
} from "./common";
import { IComparer, IEnumerable, IEqualityComparer } from "./interfaces";
import { List } from "./list";

export interface IDictionary<TKey, TValue>
  extends IEnumerable<KeyValuePair<TKey, TValue>> {
  add(key: TKey, value: TValue): void;
  addRange(items: KeyValuePair<TKey, TValue>[]): void;
  remove(predicate: (item: KeyValuePair<TKey, TValue>) => boolean): void;
  clear(): void;

  containsKey(key: TKey): boolean;
  containsValue(value: TValue): boolean;
  tryGetValue(key: TKey): TValue | null;
}

export class Dictionary<TKey, TValue> implements IDictionary<TKey, TValue> {
  private list: KeyValuePair<TKey, TValue>[] = new Array<
    KeyValuePair<TKey, TValue>
  >();

  constructor(list: KeyValuePair<TKey, TValue>[] = []) {
    if (list) {
      this.list = list;
    }
  }

  public add(key: TKey, value: TValue): void {
    const pair = new KeyValuePair<TKey, TValue>(key, value);

    if (this.containsKey(key)) {
      throw new Error("Duplicate key. Cannot add.");
    }

    this.list.push(pair);
  }

  public addRange(items: KeyValuePair<TKey, TValue>[]): void {
    items.forEach(x => this.add(x.key, x.value));
  }

  public clear(): void {
    this.list = new Array<KeyValuePair<TKey, TValue>>();
  }

  public remove(
    predicate: (item: KeyValuePair<TKey, TValue>) => boolean
  ): void {
    const result = new Array<KeyValuePair<TKey, TValue>>();
    this.list.forEach(element => {
      if (!predicate(element)) {
        result.push(element);
      }
    });

    this.list = result;
  }

  public containsKey(key: TKey): boolean {
    return this.any(x => objCompare(x.key, key));
  }

  public containsValue(value: TValue): boolean {
    return this.any(x => objCompare(x.value, value));
  }

  public tryGetValue(key: TKey): TValue | null {
    const item = this.singleOrDefault(x => objCompare(x.key, key));
    if (item) {
      return item.value;
    }
    return null;
  }

  /* IEnumerable */

  public asEnumerable(): IEnumerable<KeyValuePair<TKey, TValue>> {
    return this;
  }

  public get length(): number {
    return this.list.length;
  }

  public elementAt(index: number): KeyValuePair<TKey, TValue> {
    try {
      return this.list[index];
    } catch (e) {
      throw new Error(e);
    }
  }

  public any(
    predicate?: (item: KeyValuePair<TKey, TValue>) => boolean
  ): boolean {
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

  public all(
    predicate?: (item: KeyValuePair<TKey, TValue>) => boolean
  ): boolean {
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

  public single(
    predicate?: (item: KeyValuePair<TKey, TValue>) => boolean
  ): KeyValuePair<TKey, TValue> {
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

  public first(
    predicate?: (item: KeyValuePair<TKey, TValue>) => boolean
  ): KeyValuePair<TKey, TValue> {
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

  public last(
    predicate?: (item: KeyValuePair<TKey, TValue>) => boolean
  ): KeyValuePair<TKey, TValue> {
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

  public singleOrDefault(
    predicate: (item: KeyValuePair<TKey, TValue>) => boolean
  ): KeyValuePair<TKey, TValue> | null {
    const temp = new Array<KeyValuePair<TKey, TValue>>();
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
    }

    return temp[0];
  }

  public firstOrDefault(
    predicate: (item: KeyValuePair<TKey, TValue>) => boolean
  ): KeyValuePair<TKey, TValue> | null {
    for (let i = 0; i < this.length; i++) {
      const item = this.list[i];
      if (predicate(item)) {
        return item;
      }
    }

    return null;
  }

  public lastOrDefault(
    predicate: (item: KeyValuePair<TKey, TValue>) => boolean
  ): KeyValuePair<TKey, TValue> | null {
    for (let i = this.length; i >= 0; i--) {
      const item = this.list[i - 1];
      if (predicate(item)) {
        return item;
      }
    }

    return null;
  }

  public where(
    predicate: (item: KeyValuePair<TKey, TValue>) => boolean
  ): IDictionary<TKey, TValue> {
    const result = new Dictionary<TKey, TValue>();
    this.list.filter(element => {
      if (predicate(element)) {
        result.add(element.key, element.value);
      }
    });
    return result;
  }

  public select<TResult>(
    predicate: (item: KeyValuePair<TKey, TValue>) => TResult
  ): IEnumerable<TResult> {
    const result = new List<TResult>();
    this.forEach(x => result.add(predicate(x)));
    return result;
  }

  public forEach(predicate: (item: KeyValuePair<TKey, TValue>) => void): void {
    this.list.forEach(x => predicate(x));
  }

  public toArray(): KeyValuePair<TKey, TValue>[] {
    return this.list;
  }

  public join<TOuter, TMatch, TResult>(
    outer: IEnumerable<TOuter>,
    conditionInner: (item: KeyValuePair<TKey, TValue>) => TMatch,
    conditionOuter: (item: TOuter) => TMatch,
    select: (x: KeyValuePair<TKey, TValue>, y?: TOuter) => TResult,
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

  public groupBy(
    predicate: (item: KeyValuePair<TKey, TValue>) => any[]
  ): IEnumerable<Group<KeyValuePair<TKey, TValue>>> {
    const groups: { [key: string]: KeyValuePair<TKey, TValue>[] } = {};
    this.list.forEach(o => {
      const group = JSON.stringify(predicate(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    const g = Object.keys(groups).map(group => {
      const a = group.substr(1, group.length - 2);
      const grp = new Group<KeyValuePair<TKey, TValue>>(
        a.split(","),
        groups[group]
      );
      return grp;
    });

    return new List<Group<KeyValuePair<TKey, TValue>>>(g);
  }

  public orderBy(
    comparer: IComparer<KeyValuePair<TKey, TValue>>
  ): IEnumerable<KeyValuePair<TKey, TValue>> {
    const temp = this.list.sort((x, y) => comparer.compare(x, y));
    return new List<KeyValuePair<TKey, TValue>>(temp);
  }

  public distinct(
    comparer: IEqualityComparer<KeyValuePair<TKey, TValue>>
  ): IEnumerable<KeyValuePair<TKey, TValue>> {
    const uniques = new List<KeyValuePair<TKey, TValue>>();
    this.forEach(x => {
      uniques.forEach(y => {
        if (!comparer.equals(x, y)) {
          uniques.add(x);
        }
      });
    });

    return uniques;
  }

  public union(
    list: IEnumerable<KeyValuePair<TKey, TValue>>
  ): IDictionary<TKey, TValue> {
    this.addRange(list.toArray());
    return this;
  }

  public skip(no: number): IDictionary<TKey, TValue> {
    if (no > 0) {
      return new Dictionary(this.list.slice(no, this.list.length - 1));
    }
    return this;
  }

  public take(no: number): IDictionary<TKey, TValue> {
    if (no > 0) {
      return new Dictionary(this.list.slice(0, no));
    }
    return this;
  }

  public sum(predicate: (item: KeyValuePair<TKey, TValue>) => number): number {
    let sum = 0;
    this.list.forEach(x => (sum = sum + predicate(x)));
    return sum;
  }

  public avg(predicate: (item: KeyValuePair<TKey, TValue>) => number): number {
    return this.sum(predicate) / this.length;
  }

  public min(predicate: (item: KeyValuePair<TKey, TValue>) => number): number {
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

  public max(predicate: (item: KeyValuePair<TKey, TValue>) => number): number {
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

  public count(
    predicate?: (item: KeyValuePair<TKey, TValue>) => boolean
  ): number {
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

// tslint:disable-next-line:max-classes-per-file
export class KeyValuePair<TKey, TValue> {
  public key: TKey;
  public value: TValue;

  constructor(key: TKey, value: TValue) {
    this.key = key;
    this.value = value;
  }
}
