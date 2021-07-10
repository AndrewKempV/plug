import { EventPackageModel } from "app/api/profile/api";
export type EventPackage = EventPackageModel;
export type PackageType = "PAID" | "FREE" | "DONATION";
export interface SelectableTag {
  title: string;
  selected: boolean;
}
