import { IGeo } from "./IGeo";

interface IAddress {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: IGeo;
}

export { IAddress };
