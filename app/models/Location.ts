// import { Location } from "app/api/profile";
import { Location } from "app/features/location/reducer";

export type BoundedLocation = Location & {
  bbox?:
    | [number, number, number, number]
    | [number, number, number, number, number, number]
    | undefined;
} & { name?: string };
