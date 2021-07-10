/**
 * ISC License
 * Copyright (c) 2017, Yaga.js-Team
 *
 * Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted,
 * provided that the above copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
 * THIS SOFTWARE.
 */
import Feature = GeoJSON.Feature;
import FeatureCollection = GeoJSON.FeatureCollection;
import GeometryObject = GeoJSON.GeometryObject;

export interface GenericGeoJSONFeature<G extends GeometryObject, T>
  extends Feature<G> {
  properties: T;
}

export interface GenericGeoJSONFeatureCollection<G extends GeometryObject, T>
  extends FeatureCollection<G> {
  features: GenericGeoJSONFeature<G, T>[];
}
