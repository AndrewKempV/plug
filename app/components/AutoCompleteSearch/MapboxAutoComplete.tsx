import { debounce } from "lodash";
import * as React from "react";
import { isFunction } from "../../types";
import {
  MapboxLocationResponse,
  MapboxQueryType,
  MapboxService
} from "../../utils/MapboxService";

export interface DefaultProps {
  minLength: number;
  debounce: number;
  language: string;
  queryTypes: MapboxQueryType[];

}

export type Props = Partial<
  {
    children: RenderCallback;
    render: RenderCallback;
    components: string;
    radius: string;
    bbox: number[];
    limit: number;
  } & DefaultProps
> & {
  /**
   * Api Key provided by mapbox
   */
  apiKey: string;
};

export type State = Readonly<{
  inputValue: string;
  locationResults: MapboxLocationResponse | null;
  isSearching: boolean;
}>;

export type RenderCallback = (args: RenderProps) => JSX.Element;

export interface RenderProps {
  inputValue: State["inputValue"];
  locationResults: State["locationResults"];
  handleTextChange: (value: string) => void;
  //   fetchDetails: (placeId: string) => Promise<MapboxLocationDetailResult>;
  clearSearch: () => void;
  isSearching: boolean;
}

export const initialState = {
  inputValue: "",
  locationResults: null,
  isSearching: false
};

const defaultProps: DefaultProps = {
  /**
   * Minimun length of the input before start fetching - default: 2
   */
  minLength: 2,
  /**
   * Debounce request time in ms - default: 300
   */
  debounce: 300,
  /**
   * Language for Mapbox query - default: en
   */
  language: "en",
  queryTypes: []
};

export class MapboxAutoComplete extends React.PureComponent<Props, State> {

  public static readonly defaultProps = defaultProps;
  public readonly state = initialState;

  /**
   * Query the mapbox places api
   */
  search = debounce(async (term: string) => {
    const { queryTypes, bbox, limit } = this.props;
    const types: MapboxQueryType[] =
      (queryTypes?.length || 0) < 1 ? ["address", "place", "poi"] : this.props.queryTypes!;
    this.setState({ isSearching: true });
    try {
      const results = await MapboxService.search(term, types, "mapbox.places", bbox, limit);
      this.setState({
        locationResults: results.predictions,
        isSearching: false
      });
    } catch (error) {
      throw error;
    }
  }, this.props.debounce);

  render() {
    const renderProps = {
      inputValue: this.state.inputValue,
      locationResults: this.state.locationResults,
      handleTextChange: this.handleTextChange,
      isSearching: this.state.isSearching,
      clearSearch: this.clearSearch
    };

    if (this.props.render) {
      return this.props.render(renderProps);
    }

    return isFunction(this.props.children)
      ? this.props.children(renderProps)
      : null;
  }

  clearSearch = () => {
    this.setState({ locationResults: null });
  };

  /**
   * Handle the input change for react-native
   */
  handleTextChange = (inputValue: string) => {
    if (this.props.apiKey == null) {
      throw new Error("Api Key is required");
    }
    this.setState({ inputValue });
    if (inputValue.length >= this.props.minLength!) {
      this.search(inputValue);
    }
  };
}
