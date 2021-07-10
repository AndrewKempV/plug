import React, { PureComponent } from "react";
import {
  Animated,
  Easing,
  FlatList,
  I18nManager,
  Platform,
  ScrollView,
  View,
  ViewStyle,
  StyleProp,
  NativeScrollEvent,
  NativeSyntheticEvent,
  LayoutChangeEvent,
  ScrollViewProps,
  GestureResponderEvent,
  VirtualizedListProps,
  ListRenderItemInfo
} from "react-native";
import {
  defaultScrollInterpolator,
  stackScrollInterpolator,
  tinderScrollInterpolator,
  defaultAnimatedStyles,
  shiftAnimatedStyles,
  stackAnimatedStyles,
  tinderAnimatedStyles
} from "./animations";
import { ParallaxImageProps } from "./ParallaxImage";

const IS_IOS = Platform.OS === "ios";
// React Native automatically handles RTL layouts; unfortunately, it's buggy with horizontal ScrollView
// See https://github.com/facebook/react-native/issues/11960
// NOTE: the following variable is not declared in the constructor
// otherwise it is undefined at init, which messes with custom indexes

const IS_RTL = I18nManager.isRTL;
// Native driver for scroll events
// See: https://facebook.github.io/react-native/blog/2017/02/14/using-native-driver-for-animated.html
const AnimatedFlatList = FlatList
  ? Animated.createAnimatedComponent(FlatList)
  : null;
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

type LayoutOption = "default" | "stack" | "tinder";
type SlideAlignment = "center" | "end" | "start";

interface CarouselItemBounds {
  start: number;
  end: number;
}
export interface CarouselRenderItemInfo<T>
  extends Omit<ListRenderItemInfo<T>, "separators"> {
  parallaxProps: Omit<ParallaxImageProps, "source" | "parallaxFactor">;
}

export interface RequiredProps<T>
  extends ScrollViewProps,
    Omit<VirtualizedListProps<T>, "renderItem"> {
  data: T[];
  renderItem: (renderProps: CarouselRenderItemInfo<T>) => JSX.Element;
  firstItem: number;
  loop: boolean;
  loopClonesPerSide: number;
  itemWidth: number; // required for horizontal carousel
  itemHeight: number; // required for vertical carousel
  sliderWidth: number; // required for horizontal carousel
  sliderHeight: number; // required for vertical carousel
  activeSlideAlignment: SlideAlignment;
  activeSlideOffset: number;
  apparitionDelay: number;
  autoplay: boolean;
  autoplayDelay: number;
  autoplayInterval: number;
  callbackOffsetMargin: number;
  containerCustomStyle: StyleProp<ViewStyle>;
  contentContainerCustomStyle: StyleProp<ViewStyle>;
  enableMomentum: boolean;
  enableSnap: boolean;
  activeAnimationType: string;
  activeAnimationOptions: Record<string, any>;
  hasParallaxImages: boolean;
  inactiveSlideOpacity: number;
  inactiveSlideScale: number;
  inactiveSlideShift: number;
  layout: LayoutOption;
  lockScrollTimeoutDuration: number;
  lockScrollWhileSnapping: boolean;
  scrollEnabled: boolean;
  slideStyle: StyleProp<ViewStyle>;
  shouldOptimizeUpdates: boolean;
  swipeThreshold: number;
  useScrollView: boolean | Function;
  vertical: boolean;
}
type OptionalProps = Partial<{
  layoutCardOffset: number;
  scrollInterpolator: Function;
  slideInterpolatedStyle: Function;
  onBeforeSnapToItem: (index: number) => void;
  onSnapToItem: (index: number) => void;
  firstItemOffset?: number;
  lastItemOffset?: number;
}>;

export type CarouselProps<T> = RequiredProps<T> & OptionalProps;

interface State {
  interpolators: (Animated.Value | Animated.AnimatedInterpolation)[];
  hideCarousel: boolean;
}

export default class Carousel<T> extends PureComponent<
  CarouselProps<T>,
  State
> {
  public static defaultProps: CarouselProps<any> = {
    activeAnimationType: "timing",
    activeAnimationOptions: {},
    activeSlideAlignment: "center",
    activeSlideOffset: 20,
    apparitionDelay: 0,
    autoplay: false,
    autoplayDelay: 1000,
    autoplayInterval: 3000,
    callbackOffsetMargin: 5,
    containerCustomStyle: {},
    contentContainerCustomStyle: {},
    enableMomentum: false,
    enableSnap: true,
    firstItem: 0,
    hasParallaxImages: false,
    inactiveSlideOpacity: 0.7,
    inactiveSlideScale: 0.9,
    inactiveSlideShift: 0,
    layout: "default",
    lockScrollTimeoutDuration: 1000,
    lockScrollWhileSnapping: false,
    loop: false,
    loopClonesPerSide: 3,
    scrollEnabled: true,
    slideStyle: {},
    shouldOptimizeUpdates: true,
    swipeThreshold: 20,
    useScrollView: !AnimatedFlatList,
    vertical: false,
    data: [],
    renderItem: (renderProps: CarouselRenderItemInfo<any>) => {
      return <View />;
    },
    itemHeight: 100,
    itemWidth: 100,
    sliderWidth: 200,
    sliderHeight: 200
  };

  public readonly state: State = {
    interpolators: [],
    hideCarousel: false
  };

  carouselRef: FlatList<T> | undefined = undefined;
  _mounted: boolean = false;
  activeItem: number = 0;
  previousItemsLength: number = 0;
  previousFirstItem: number = 0;
  currentContentOffset: number = 0;
  scrollPos: Animated.Value = new Animated.Value(0);

  itemToSnapTo: number = 0;
  scrollOffsetRef: number = 0;
  onScrollTriggered: boolean = false;
  lastScrollDate: number = 0;
  canFireBeforeCallback: boolean = true;
  canFireCallback: boolean = true;
  autoplaying: boolean = false;
  previousActiveItem: number = 0;
  scrollEnabled: boolean = true;

  scrollEndOffset: number = 0;
  scrollEndActive: number = 0;
  scrollStartOffset: number = 0;
  scrollStartActive: number = 0;
  onScrollHandler: any;
  onLayoutInitDone: boolean = false;
  ignoreNextMomentum: boolean = false;

  edgeItemTimeout: NodeJS.Timeout | null = null;
  autoplayTimeout: NodeJS.Timeout | null = null;
  autoplayInterval: NodeJS.Timeout | null = null;
  lockScrollTimeout: NodeJS.Timeout | null = null;
  hackSlideAnimationTimeout: NodeJS.Timeout | null = null;
  snapNoMomentumTimeout: NodeJS.Timeout | null = null;
  enableAutoplayTimeout: NodeJS.Timeout | null = null;
  apparitionTimeout: NodeJS.Timeout | null = null;

  positions: CarouselItemBounds[] = [];

  constructor(props: CarouselProps<T>) {
    super(props);

    this.state = {
      hideCarousel: true,
      interpolators: []
    };

    // The following values are not stored in the state because 'setState()' is asynchronous
    // and this results in an absolutely crappy behavior on Android while swiping
    const initialActiveItem = this.getFirstItem(props.firstItem);
    this.activeItem = initialActiveItem;
    this.previousActiveItem = initialActiveItem;
    this.previousFirstItem = initialActiveItem;
    this.previousItemsLength = initialActiveItem;

    this._mounted = false;
    this.positions = [];
    this.currentContentOffset = 0; // store ScrollView's scroll position
    this.canFireBeforeCallback = false;
    this.canFireCallback = false;
    this.scrollOffsetRef = 0; //null;
    this.onScrollTriggered = true; // used when momentum is enabled to prevent an issue with edges items
    this.lastScrollDate = 0; // used to work around a FlatList bug
    this.scrollEnabled = props.scrollEnabled !== false;

    this.initPositionsAndInterpolators = this.initPositionsAndInterpolators.bind(
      this
    );
    this.renderItem = this.renderItem.bind(this);
    this.onSnap = this.onSnap.bind(this);

    this.onLayout = this.onLayout.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.onScrollBeginDrag = this.onScrollBeginDrag.bind(this);
    this.onScrollEnd = this.onScrollEnd.bind(this);
    this.onScrollEndDrag = this.onScrollEndDrag.bind(this);
    this.onMomentumScrollEnd = this.onMomentumScrollEnd.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onTouchRelease = this.onTouchRelease.bind(this);

    this.getKeyExtractor = this.getKeyExtractor.bind(this);

    this.setScrollHandler(props);

    // This bool aims at fixing an iOS bug due to scrollTo that triggers onMomentumScrollEnd.
    // onMomentumScrollEnd fires this._snapScroll, thus creating an infinite loop.
    this.ignoreNextMomentum = false;
  }

  componentDidMount() {
    const { apparitionDelay, autoplay, firstItem } = this.props;
    const _firstItem = this.getFirstItem(firstItem);
    const apparitionCallback = () => {
      this.setState({ hideCarousel: false });
      if (autoplay) {
        this.startAutoplay();
      }
    };

    this._mounted = true;
    this.initPositionsAndInterpolators();
    // Without 'requestAnimationFrame' or a `0` timeout, images will randomly not be rendered on Android...
    requestAnimationFrame(() => {
      if (!this._mounted) {
        return;
      }
      this._snapToItem(_firstItem, false, false, true, false);
      this.hackActiveSlideAnimation(_firstItem, "start", true);

      if (apparitionDelay) {
        this.apparitionTimeout = setTimeout(() => {
          apparitionCallback();
        }, apparitionDelay);
      } else {
        apparitionCallback();
      }
    });
  }

  // shouldComponentUpdate (nextProps: CarouselProps<T>, nextState: State) {
  //     if (this.props.shouldOptimizeUpdates === false) {
  //         return true;
  //     } else {
  //         return false;//  shallowCompare(this, nextProps, nextState);
  //     }
  // }

  componentWillReceiveProps(nextProps: CarouselProps<T>) {
    const { interpolators } = this.state;
    const {
      firstItem,
      itemHeight,
      itemWidth,
      scrollEnabled,
      sliderHeight,
      sliderWidth
    } = nextProps;
    const itemsLength = this.getCustomDataLength(nextProps);

    if (!itemsLength) {
      return;
    }

    const nextFirstItem = this.getFirstItem(firstItem, nextProps);
    let nextActiveItem =
      this.activeItem || this.activeItem === 0
        ? this.activeItem
        : nextFirstItem;

    const hasNewSliderWidth =
      sliderWidth && sliderWidth !== this.props.sliderWidth;
    const hasNewSliderHeight =
      sliderHeight && sliderHeight !== this.props.sliderHeight;
    const hasNewItemWidth = itemWidth && itemWidth !== this.props.itemWidth;
    const hasNewItemHeight = itemHeight && itemHeight !== this.props.itemHeight;
    const hasNewScrollEnabled = scrollEnabled !== this.props.scrollEnabled;

    // Prevent issues with dynamically removed items
    if (nextActiveItem > itemsLength - 1) {
      nextActiveItem = itemsLength - 1;
    }

    // Handle changing scrollEnabled independent of user -> carousel interaction
    if (hasNewScrollEnabled) {
      this.setScrollEnabled(scrollEnabled);
    }

    if (
      interpolators.length !== itemsLength ||
      hasNewSliderWidth ||
      hasNewSliderHeight ||
      hasNewItemWidth ||
      hasNewItemHeight
    ) {
      this.activeItem = nextActiveItem;
      this.previousItemsLength = itemsLength;
      this.initPositionsAndInterpolators(nextProps);

      // Handle scroll issue when dynamically removing items (see #133)
      // This also fixes first item's active state on Android
      // Because 'initialScrollIndex' apparently doesn't trigger scroll
      if (this.previousItemsLength > itemsLength) {
        this.hackActiveSlideAnimation(nextActiveItem, undefined, true);
      }

      if (
        hasNewSliderWidth ||
        hasNewSliderHeight ||
        hasNewItemWidth ||
        hasNewItemHeight
      ) {
        this._snapToItem(nextActiveItem, false, false, false, false);
      }
    } else if (
      nextFirstItem !== this.previousFirstItem &&
      nextFirstItem !== this.activeItem
    ) {
      this.activeItem = nextFirstItem;
      this.previousFirstItem = nextFirstItem;
      this._snapToItem(nextFirstItem, false, true, false, false);
    }

    if (nextProps.onScroll !== this.props.onScroll) {
      this.setScrollHandler(nextProps);
    }
  }

  componentWillUnmount() {
    this._mounted = false;
    this.stopAutoplay();
    if (this.apparitionTimeout) {
      clearTimeout(this.apparitionTimeout);
    }
    if (this.hackSlideAnimationTimeout) {
      clearTimeout(this.hackSlideAnimationTimeout);
    }
    if (this.enableAutoplayTimeout) {
      clearTimeout(this.enableAutoplayTimeout);
    }
    if (this.autoplayTimeout) {
      clearTimeout(this.autoplayTimeout);
    }
    if (this.snapNoMomentumTimeout) {
      clearTimeout(this.snapNoMomentumTimeout);
    }
    if (this.edgeItemTimeout) {
      clearTimeout(this.edgeItemTimeout);
    }
    if (this.lockScrollTimeout) {
      clearTimeout(this.lockScrollTimeout);
    }
  }

  get realIndex() {
    return this.activeItem;
  }

  get currentIndex() {
    return this.getDataIndex(this.activeItem);
  }

  get currentScrollPosition() {
    return this.currentContentOffset;
  }

  setScrollHandler(props: CarouselProps<T>) {
    // Native driver for scroll events
    const scrollEventConfig = {
      listener: this.onScroll,
      useNativeDriver: true
    };
    this.scrollPos = new Animated.Value(0);
    const argMapping = props.vertical
      ? [{ nativeEvent: { contentOffset: { y: this.scrollPos } } }]
      : [{ nativeEvent: { contentOffset: { x: this.scrollPos } } }];

    if (props.onScroll && Array.isArray(props.onScroll.arguments)) {
      // Because of a react-native issue https://github.com/facebook/react-native/issues/13294
      argMapping.pop();
      const [argMap] = props.onScroll.arguments;
      if (argMap && argMap.nativeEvent && argMap.nativeEvent.contentOffset) {
        // Shares the same animated value passed in props
        this.scrollPos =
          argMap.nativeEvent.contentOffset.x ||
          argMap.nativeEvent.contentOffset.y ||
          this.scrollPos;
      }
      argMapping.push(...props.onScroll.arguments);
    }
    this.onScrollHandler = Animated.event(argMapping, scrollEventConfig);
  }

  needsScrollView = () => {
    const { useScrollView } = this.props;
    return (
      useScrollView ||
      !AnimatedFlatList ||
      this.shouldUseStackLayout() ||
      this.shouldUseTinderLayout()
    );
  };

  needsRTLAdaptations() {
    const { vertical } = this.props;
    return IS_RTL && !IS_IOS && !vertical;
  }

  canLockScroll() {
    const {
      scrollEnabled,
      enableMomentum,
      lockScrollWhileSnapping
    } = this.props;
    return scrollEnabled && !enableMomentum && lockScrollWhileSnapping;
  }

  enableLoop() {
    const { data, enableSnap, loop } = this.props;
    return enableSnap && loop && data && data.length && data.length > 1;
  }

  shouldAnimateSlides(props = this.props) {
    const {
      inactiveSlideOpacity,
      inactiveSlideScale,
      scrollInterpolator,
      slideInterpolatedStyle
    } = props;
    return (
      inactiveSlideOpacity < 1 ||
      inactiveSlideScale < 1 ||
      !!scrollInterpolator ||
      !!slideInterpolatedStyle ||
      this.shouldUseShiftLayout() ||
      this.shouldUseStackLayout() ||
      this.shouldUseTinderLayout()
    );
  }

  shouldUseCustomAnimation() {
    const { activeAnimationOptions } = this.props;
    return (
      !!activeAnimationOptions &&
      !this.shouldUseStackLayout() &&
      !this.shouldUseTinderLayout()
    );
  }

  shouldUseShiftLayout() {
    const { inactiveSlideShift, layout } = this.props;
    return layout === "default" && inactiveSlideShift !== 0;
  }

  shouldUseStackLayout() {
    return this.props.layout === "stack";
  }

  shouldUseTinderLayout() {
    return this.props.layout === "tinder";
  }

  getCustomData(props = this.props) {
    const { data, loopClonesPerSide } = props;
    const dataLength = data && data.length;

    if (!dataLength) {
      return [];
    }

    if (!this.enableLoop()) {
      return data;
    }

    let previousItems = [];
    let nextItems = [];
    if (loopClonesPerSide > dataLength) {
      const dataMultiplier = Math.floor(loopClonesPerSide / dataLength);
      const remainder = loopClonesPerSide % dataLength;

      for (let i = 0; i < dataMultiplier; i++) {
        previousItems.push(...data);
        nextItems.push(...data);
      }
      previousItems.unshift(...data.slice(-remainder));
      nextItems.push(...data.slice(0, remainder));
    } else {
      previousItems = data.slice(-loopClonesPerSide);
      nextItems = data.slice(0, loopClonesPerSide);
    }

    return previousItems.concat(data, nextItems);
  }

  getCustomDataLength(props = this.props) {
    const { data, loopClonesPerSide } = props;
    const dataLength = data && data.length;

    if (!dataLength) {
      return 0;
    }
    return this.enableLoop() ? dataLength + 2 * loopClonesPerSide : dataLength;
  }

  getCustomIndex(index: number, props = this.props) {
    const itemsLength = this.getCustomDataLength(props);

    if (!itemsLength || (!index && index !== 0)) {
      return 0;
    }
    return this.needsRTLAdaptations() ? itemsLength - index - 1 : index;
  }

  getDataIndex(index: number) {
    const { data, loopClonesPerSide } = this.props;
    const dataLength = data && data.length;

    if (!this.enableLoop() || !dataLength) {
      return index;
    }

    if (index >= dataLength + loopClonesPerSide) {
      return loopClonesPerSide > dataLength
        ? (index - loopClonesPerSide) % dataLength
        : index - dataLength - loopClonesPerSide;
    } else if (index < loopClonesPerSide) {
      // TODO: is there a simpler way of determining the interpolated index?
      if (loopClonesPerSide > dataLength) {
        const baseDataIndexes: number[] = [];
        const dataIndexes: number[] = [];
        const dataMultiplier = Math.floor(loopClonesPerSide / dataLength);
        const remainder = loopClonesPerSide % dataLength;

        for (let i = 0; i < dataLength; i++) {
          baseDataIndexes.push(i);
        }

        for (let j = 0; j < dataMultiplier; j++) {
          dataIndexes.push(...baseDataIndexes);
        }

        dataIndexes.unshift(...baseDataIndexes.slice(-remainder));
        return dataIndexes[index];
      } else {
        return index + dataLength - loopClonesPerSide;
      }
    } else {
      return index - loopClonesPerSide;
    }
  }

  // Used with `snapToItem()` and 'PaginationDot'
  getPositionIndex(index: number) {
    const { loop, loopClonesPerSide } = this.props;
    return loop ? index + loopClonesPerSide : index;
  }

  getFirstItem(index: number, props = this.props) {
    const { loopClonesPerSide } = props;
    const itemsLength = this.getCustomDataLength(props);

    if (!itemsLength || index > itemsLength - 1 || index < 0) {
      return 0;
    }

    return this.enableLoop() ? index + loopClonesPerSide : index;
  }

  getWrappedRef() {
    // console.log(this._carouselRef);
    // https://github.com/facebook/react-native/issues/10635
    // https://stackoverflow.com/a/48786374/8412141
    return (
      this.carouselRef && this.carouselRef.getNode && this.carouselRef.getNode()
    );
  }

  getScrollEnabled() {
    return this.scrollEnabled;
  }

  setScrollEnabled(scrollEnabled = true) {
    const wrappedRef = this.getWrappedRef();

    if (!wrappedRef) {
      return;
    }
    // 'setNativeProps()' is used instead of 'setState()' because the latter
    // really takes a toll on Android behavior when momentum is disabled
    // wrappedRef.setNativeProps({ scrollEnabled });
    this.scrollEnabled = scrollEnabled;
  }

  getKeyExtractor(index: number) {
    return this.needsScrollView()
      ? `scrollview-item-${JSON.stringify(index)}`
      : `flatlist-item-${JSON.stringify(index)}`;
  }

  getScrollOffset(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const { vertical } = this.props;
    return (
      (event &&
        event.nativeEvent &&
        event.nativeEvent.contentOffset &&
        event.nativeEvent.contentOffset[vertical ? "y" : "x"]) ||
      0
    );
  }

  getContainerInnerMargin(opposite = false) {
    const {
      sliderWidth,
      sliderHeight,
      itemWidth,
      itemHeight,
      vertical,
      activeSlideAlignment
    } = this.props;

    if (
      (activeSlideAlignment === "start" && !opposite) ||
      (activeSlideAlignment === "end" && opposite)
    ) {
      return 0;
    }
    if (
      (activeSlideAlignment === "end" && !opposite) ||
      (activeSlideAlignment === "start" && opposite)
    ) {
      return vertical ? sliderHeight - itemHeight : sliderWidth - itemWidth;
    }
    return vertical
      ? (sliderHeight - itemHeight) / 2
      : (sliderWidth - itemWidth) / 2;
  }

  getViewportOffset() {
    const {
      sliderWidth,
      sliderHeight,
      itemWidth,
      itemHeight,
      vertical,
      activeSlideAlignment
    } = this.props;

    if (activeSlideAlignment === "start") {
      return vertical ? itemHeight / 2 : itemWidth / 2;
    }
    if (activeSlideAlignment === "end") {
      return vertical
        ? sliderHeight - itemHeight / 2
        : sliderWidth - itemWidth / 2;
    }
    return vertical ? sliderHeight / 2 : sliderWidth / 2;
  }

  getCenter(offset: number) {
    return offset + this.getViewportOffset() - this.getContainerInnerMargin();
  }

  getActiveItem(offset: number) {
    // console.log(this._positions);
    const { activeSlideOffset, swipeThreshold } = this.props;
    const center = this.getCenter(offset);
    const centerOffset = activeSlideOffset || swipeThreshold;

    for (let i = 0; i < this.positions.length; i++) {
      const { start, end } = this.positions[i];
      if (center + centerOffset >= start && center - centerOffset <= end) {
        return i;
      }
    }

    const lastIndex = this.positions.length - 1;
    if (
      this.positions[lastIndex] &&
      center - centerOffset > this.positions[lastIndex].end
    ) {
      return lastIndex;
    }

    return 0;
  }

  initPositionsAndInterpolators(props = this.props) {
    const { data, itemWidth, itemHeight, scrollInterpolator, vertical } = props;
    const sizeRef = vertical ? itemHeight : itemWidth;

    if (!data || !data.length) {
      return;
    }

    const interpolators: (
      | Animated.Value
      | Animated.AnimatedInterpolation)[] = [];
    this.positions = [];

    this.getCustomData(props).forEach((itemData, index) => {
      const _index = this.getCustomIndex(index, props);
      let animatedValue: Animated.Value | Animated.AnimatedInterpolation;
      // console.log(this.positions);
      if (index === 0 && this.props.firstItemOffset) {
        this.positions[index] = {
          start: index * sizeRef + this.props.firstItemOffset,
          end: index * sizeRef + sizeRef + this.props.firstItemOffset
        };
      } else if (index === data.length - 1 && this.props.lastItemOffset) {
        this.positions[index] = {
          start: index * sizeRef + this.props.lastItemOffset,
          end: index * sizeRef + sizeRef + this.props.lastItemOffset
        };
      } else {
        this.positions[index] = {
          start: index * sizeRef,
          end: index * sizeRef + sizeRef
        };
      }

      if (!this.shouldAnimateSlides(props)) {
        animatedValue = new Animated.Value(1);
      } else if (this.shouldUseCustomAnimation()) {
        animatedValue = new Animated.Value(_index === this.activeItem ? 1 : 0);
      } else {
        let interpolator;

        if (scrollInterpolator) {
          interpolator = scrollInterpolator(_index, props);
        } else if (this.shouldUseStackLayout()) {
          interpolator = stackScrollInterpolator(_index, props);
        } else if (this.shouldUseTinderLayout()) {
          interpolator = tinderScrollInterpolator(_index, props);
        }

        if (
          !interpolator ||
          !interpolator.inputRange ||
          !interpolator.outputRange
        ) {
          interpolator = defaultScrollInterpolator(_index, props);
        }

        animatedValue = this.scrollPos.interpolate({
          ...interpolator,
          extrapolate: "clamp"
        });
      }

      interpolators.push(animatedValue);
    });

    this.setState({ interpolators });
  }

  getSlideAnimation(index: number, toValue: number) {
    const { interpolators } = this.state;
    const { activeAnimationType, activeAnimationOptions } = this.props;

    const animatedValue = interpolators && interpolators[index];

    if (!animatedValue && animatedValue !== 0) {
      return null;
    }

    const animationCommonOptions = {
      isInteraction: false,
      useNativeDriver: true,
      ...activeAnimationOptions,
      toValue: toValue
    };

    return Animated.parallel([
      Animated["timing"](animatedValue, {
        ...animationCommonOptions,
        easing: Easing.linear
      }),
      Animated[activeAnimationType](animatedValue, {
        ...animationCommonOptions
      })
    ]);
  }

  playCustomSlideAnimation(current: number, next: number) {
    const { interpolators } = this.state;
    const itemsLength = this.getCustomDataLength();
    const _currentIndex = this.getCustomIndex(current);
    const _currentDataIndex = this.getDataIndex(_currentIndex);
    const _nextIndex = this.getCustomIndex(next);
    const _nextDataIndex = this.getDataIndex(_nextIndex);
    const animations: Animated.CompositeAnimation[] = [];
    //console.log(interpolators);
    // Keep animations in sync when looping
    if (this.enableLoop()) {
      for (let i = 0; i < itemsLength; i++) {
        if (this.getDataIndex(i) === _currentDataIndex && interpolators[i]) {
          const a = this.getSlideAnimation(i, 0);
          if (a) {
            animations.push(a);
          }
        } else if (
          this.getDataIndex(i) === _nextDataIndex &&
          interpolators[i]
        ) {
          const a = this.getSlideAnimation(i, 1);
          if (a) {
            animations.push(a);
          }
        }
      }
    } else {
      if (interpolators[current]) {
        const a = this.getSlideAnimation(current, 0);
        if (a) {
          animations.push(a);
        }
      }
      if (interpolators[next]) {
        const a = this.getSlideAnimation(next, 1);
        if (a) {
          animations.push(a);
        }
      }
    }

    Animated.parallel(animations, {
      stopTogether: false
    }).start();
  }

  hackActiveSlideAnimation(
    index: number,
    goTo?: SlideAlignment,
    force = false
  ) {
    const { data } = this.props;

    if (
      !this._mounted ||
      !this.carouselRef ||
      !this.positions[index] ||
      (!force && this.enableLoop())
    ) {
      return;
    }

    const offset = this.positions[index] && this.positions[index].start;

    if (!offset && offset !== 0) {
      return;
    }

    const itemsLength = data && data.length;
    const direction = goTo || itemsLength === 1 ? "start" : "end";

    this.scrollTo(offset + (direction === "start" ? -1 : 1), false);
    if (this.hackSlideAnimationTimeout) {
      clearTimeout(this.hackSlideAnimationTimeout);
    }
    this.hackSlideAnimationTimeout = setTimeout(() => {
      this.scrollTo(offset, false);
    }, 50); // works randomly when set to '0'
  }

  lockScroll() {
    const { lockScrollTimeoutDuration } = this.props;
    if (this.lockScrollTimeout) {
      clearTimeout(this.lockScrollTimeout);
    }
    this.lockScrollTimeout = setTimeout(() => {
      this.releaseScroll();
    }, lockScrollTimeoutDuration);
    this.setScrollEnabled(false);
  }

  releaseScroll() {
    if (this.lockScrollTimeout) {
      clearTimeout(this.lockScrollTimeout);
    }
    this.setScrollEnabled(true);
  }

  repositionScroll(index: number) {
    const { data, loopClonesPerSide } = this.props;
    const dataLength = data && data.length;

    if (
      !this.enableLoop() ||
      !dataLength ||
      (index >= loopClonesPerSide && index < dataLength + loopClonesPerSide)
    ) {
      return;
    }

    let repositionTo = index;

    if (index >= dataLength + loopClonesPerSide) {
      repositionTo = index - dataLength;
    } else if (index < loopClonesPerSide) {
      repositionTo = index + dataLength;
    }

    this._snapToItem(repositionTo, false, false, false, false);
  }

  scrollTo(offset: number, animated = true) {
    const { vertical } = this.props;
    const wrappedRef = this.getWrappedRef();

    if (!this._mounted || !wrappedRef) {
      return;
    }

    const specificOptions = this.needsScrollView()
      ? {
          x: vertical ? 0 : offset,
          y: vertical ? offset : 0
        }
      : {
          offset
        };
    const options = {
      ...specificOptions,
      animated
    };

    //console.log(wrappedRef);
    if (this.needsScrollView()) {
      wrappedRef.scrollTo(options);
    } else {
      wrappedRef.scrollToOffset(options);
    }
  }

  onScroll(event?: NativeSyntheticEvent<NativeScrollEvent>) {
    const { callbackOffsetMargin, enableMomentum, onScroll } = this.props;

    const scrollOffset = event
      ? this.getScrollOffset(event)
      : this.currentContentOffset;
    const nextActiveItem = this.getActiveItem(scrollOffset);
    const itemReached = nextActiveItem === this.itemToSnapTo;
    const scrollConditions =
      scrollOffset >= this.scrollOffsetRef - callbackOffsetMargin &&
      scrollOffset <= this.scrollOffsetRef + callbackOffsetMargin;

    this.currentContentOffset = scrollOffset;
    this.onScrollTriggered = true;
    this.lastScrollDate = Date.now();
    if (this.activeItem !== nextActiveItem && this.shouldUseCustomAnimation()) {
      this.playCustomSlideAnimation(this.activeItem, nextActiveItem);
    }

    if (enableMomentum) {
      if (this.snapNoMomentumTimeout) {
        clearTimeout(this.snapNoMomentumTimeout);
      }

      if (this.activeItem !== nextActiveItem) {
        this.activeItem = nextActiveItem;
      }

      if (itemReached) {
        if (this.canFireBeforeCallback) {
          this.onBeforeSnap(this.getDataIndex(nextActiveItem));
        }

        if (scrollConditions && this.canFireCallback) {
          this.onSnap(this.getDataIndex(nextActiveItem));
        }
      }
    } else if (this.activeItem !== nextActiveItem && itemReached) {
      if (this.canFireBeforeCallback) {
        this.onBeforeSnap(this.getDataIndex(nextActiveItem));
      }

      if (scrollConditions) {
        this.activeItem = nextActiveItem;

        if (this.canLockScroll()) {
          this.releaseScroll();
        }

        if (this.canFireCallback) {
          this.onSnap(this.getDataIndex(nextActiveItem));
        }
      }
    }

    if (
      nextActiveItem === this.itemToSnapTo &&
      scrollOffset === this.scrollOffsetRef
    ) {
      this.repositionScroll(nextActiveItem);
    }

    if (typeof onScroll === "function" && event) {
      onScroll(event);
    }
  }

  onStartShouldSetResponderCapture(event: GestureResponderEvent) {
    const { onStartShouldSetResponderCapture } = this.props;

    if (onStartShouldSetResponderCapture) {
      onStartShouldSetResponderCapture(event);
    }

    return this.getScrollEnabled();
  }

  onTouchStart(event: GestureResponderEvent) {
    const { onTouchStart } = this.props;

    // `onTouchStart` is fired even when `scrollEnabled` is set to `false`
    if (this.getScrollEnabled() !== false && this.autoplaying) {
      this.stopAutoplay();
    }

    if (onTouchStart) {
      onTouchStart(event);
    }
  }

  onTouchEnd(event: GestureResponderEvent) {
    const { onTouchEnd } = this.props;

    if (this.getScrollEnabled() !== false && !this.autoplaying) {
      // && autoplay
      // This event is buggy on Android, so a fallback is provided in _onScrollEnd()
      this.startAutoplay();
    }

    if (onTouchEnd) {
      onTouchEnd(event);
    }
  }

  // Used when `enableSnap` is ENABLED
  onScrollBeginDrag(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const { onScrollBeginDrag } = this.props;

    if (!this.getScrollEnabled()) {
      return;
    }

    this.scrollStartOffset = this.getScrollOffset(event);
    this.scrollStartActive = this.getActiveItem(this.scrollStartOffset);
    this.ignoreNextMomentum = false;
    // this._canFireCallback = false;

    if (onScrollBeginDrag) {
      onScrollBeginDrag(event);
    }
  }

  // Used when `enableMomentum` is DISABLED
  onScrollEndDrag(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const { onScrollEndDrag } = this.props;

    if (this.carouselRef) {
      this.onScrollEnd && this.onScrollEnd();
    }

    if (onScrollEndDrag) {
      onScrollEndDrag(event);
    }
  }

  // Used when `enableMomentum` is ENABLED
  onMomentumScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const { onMomentumScrollEnd } = this.props;

    if (this.carouselRef) {
      this.onScrollEnd && this.onScrollEnd();
    }

    if (onMomentumScrollEnd) {
      onMomentumScrollEnd(event);
    }
  }

  onScrollEnd() {
    const { autoplay, autoplayDelay, enableSnap } = this.props;

    if (this.ignoreNextMomentum) {
      // iOS fix
      this.ignoreNextMomentum = false;
      return;
    }

    this.scrollEndOffset = this.currentContentOffset;
    this.scrollEndActive = this.getActiveItem(this.scrollEndOffset);

    if (enableSnap) {
      this.snapScroll(this.scrollEndOffset - this.scrollStartOffset);
    }

    // The touchEnd event is buggy on Android, so this will serve as a fallback whenever needed
    // https://github.com/facebook/react-native/issues/9439
    if (autoplay && !this.autoplaying) {
      if (this.enableAutoplayTimeout) {
        clearTimeout(this.enableAutoplayTimeout);
      }
      this.enableAutoplayTimeout = setTimeout(() => {
        this.startAutoplay();
      }, autoplayDelay + 50);
    }
  }

  // Due to a bug, this event is only fired on iOS
  // https://github.com/facebook/react-native/issues/6791
  // it's fine since we're only fixing an iOS bug in it, so ...
  onTouchRelease() {
    const { enableMomentum } = this.props;

    if (enableMomentum && IS_IOS) {
      if (this.snapNoMomentumTimeout) {
        clearTimeout(this.snapNoMomentumTimeout);
      }
      this.snapNoMomentumTimeout = setTimeout(() => {
        this._snapToItem(this.activeItem);
      }, 100);
    }
  }

  onLayout(event: LayoutChangeEvent) {
    const { onLayout } = this.props;

    // Prevent unneeded actions during the first 'onLayout' (triggered on init)
    if (this.onLayoutInitDone) {
      this.initPositionsAndInterpolators();
      this._snapToItem(this.activeItem, false, false, false, false);
    } else {
      this.onLayoutInitDone = true;
    }

    if (onLayout) {
      onLayout(event);
    }
  }

  snapScroll(delta: number) {
    const { swipeThreshold } = this.props;

    // When using momentum and releasing the touch with
    // no velocity, scrollEndActive will be undefined (iOS)
    if (!this.scrollEndActive && this.scrollEndActive !== 0 && IS_IOS) {
      this.scrollEndActive = this.scrollStartActive;
    }

    if (this.scrollStartActive !== this.scrollEndActive) {
      // Snap to the new active item
      this._snapToItem(this.scrollEndActive);
    } else {
      // Snap depending on delta
      if (delta > 0) {
        if (delta > swipeThreshold) {
          this._snapToItem(this.scrollStartActive + 1);
        } else {
          this._snapToItem(this.scrollEndActive);
        }
      } else if (delta < 0) {
        if (delta < -swipeThreshold) {
          this._snapToItem(this.scrollStartActive - 1);
        } else {
          this._snapToItem(this.scrollEndActive);
        }
      } else {
        // Snap to current
        this._snapToItem(this.scrollEndActive);
      }
    }
  }

  _snapToItem(
    index: number,
    animated = true,
    fireCallback = true,
    initial = false,
    lockScroll = true
  ) {
    const { enableMomentum, onSnapToItem, onBeforeSnapToItem } = this.props;
    const itemsLength = this.getCustomDataLength();
    const wrappedRef = this.getWrappedRef();

    if (!itemsLength || !wrappedRef) {
      return;
    }

    if (!index || index < 0) {
      index = 0;
    } else if (itemsLength > 0 && index >= itemsLength) {
      index = itemsLength - 1;
    }

    if (index !== this.previousActiveItem) {
      this.previousActiveItem = index;

      // Placed here to allow overscrolling for edges items
      if (lockScroll && this.canLockScroll()) {
        this.lockScroll();
      }

      if (fireCallback) {
        if (onBeforeSnapToItem) {
          this.canFireBeforeCallback = true;
        }

        if (onSnapToItem) {
          this.canFireCallback = true;
        }
      }
    }

    this.itemToSnapTo = index;
    this.scrollOffsetRef = this.positions[index] && this.positions[index].start;
    this.onScrollTriggered = false;

    if (!this.scrollOffsetRef && this.scrollOffsetRef !== 0) {
      return;
    }

    this.scrollTo(this.scrollOffsetRef, animated);

    if (enableMomentum) {
      // iOS fix, check the note in the constructor
      if (IS_IOS && !initial) {
        this.ignoreNextMomentum = true;
      }

      // When momentum is enabled and the user is overscrolling or swiping very quickly,
      // 'onScroll' is not going to be triggered for edge items. Then callback won't be
      // fired and loop won't work since the scrollview is not going to be repositioned.
      // As a workaround, '_onScroll()' will be called manually for these items if a given
      // condition hasn't been met after a small delay.
      // WARNING: this is ok only when relying on 'momentumScrollEnd', not with 'scrollEndDrag'
      if (index === 0 || index === itemsLength - 1) {
        if (this.edgeItemTimeout) {
          clearTimeout(this.edgeItemTimeout);
        }
        this.edgeItemTimeout = setTimeout(() => {
          if (
            !initial &&
            index === this.activeItem &&
            !this.onScrollTriggered
          ) {
            this.onScroll();
          }
        }, 250);
      }
    }
  }

  onBeforeSnap(index: number) {
    const { onBeforeSnapToItem } = this.props;

    if (!this.carouselRef) {
      return;
    }

    this.canFireBeforeCallback = false;
    onBeforeSnapToItem && onBeforeSnapToItem(index);
  }

  onSnap(index: number) {
    const { onSnapToItem } = this.props;

    if (!this.carouselRef) {
      return;
    }

    this.canFireCallback = false;
    onSnapToItem && onSnapToItem(index);
  }

  startAutoplay() {
    const { autoplayInterval, autoplayDelay } = this.props;

    if (this.autoplaying) {
      return;
    }

    if (this.autoplayTimeout) {
      clearTimeout(this.autoplayTimeout);
    }
    this.autoplayTimeout = setTimeout(() => {
      this.autoplaying = true;
      this.autoplayInterval = setInterval(() => {
        if (this.autoplaying) {
          this.snapToNext();
        }
      }, autoplayInterval);
    }, autoplayDelay);
  }

  stopAutoplay() {
    this.autoplaying = false;
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  }

  snapToItem(index: number, animated = true, fireCallback = true) {
    if (!index || index < 0) {
      index = 0;
    }

    const positionIndex = this.getPositionIndex(index);
    if (positionIndex === this.activeItem) {
      return;
    }

    this._snapToItem(positionIndex, animated, fireCallback);
  }

  snapToNext(animated = true, fireCallback = true) {
    const itemsLength = this.getCustomDataLength();

    let newIndex = this.activeItem + 1;
    if (newIndex > itemsLength - 1) {
      if (!this.enableLoop()) {
        return;
      }
      newIndex = 0;
    }
    this._snapToItem(newIndex, animated, fireCallback);
  }

  snapToPrev(animated = true, fireCallback = true) {
    const itemsLength = this.getCustomDataLength();

    let newIndex = this.activeItem - 1;
    if (newIndex < 0) {
      if (!this.enableLoop()) {
        return;
      }
      newIndex = itemsLength - 1;
    }
    this._snapToItem(newIndex, animated, fireCallback);
  }

  // https://github.com/facebook/react-native/issues/1831#issuecomment-231069668
  triggerRenderingHack(offset: number) {
    // Avoid messing with user scroll
    if (Date.now() - this.lastScrollDate < 500) {
      return;
    }

    const scrollPosition = this.currentContentOffset;
    if (!scrollPosition && scrollPosition !== 0) {
      return;
    }

    const scrollOffset = offset || (scrollPosition === 0 ? 1 : -1);
    this.scrollTo(scrollPosition + scrollOffset, false);
  }

  getSlideInterpolatedStyle(
    index: number,
    animatedValue: Animated.Value | Animated.AnimatedInterpolation
  ) {
    const { layoutCardOffset, slideInterpolatedStyle } = this.props;

    if (slideInterpolatedStyle) {
      return slideInterpolatedStyle(index, animatedValue, this.props);
    }
    if (this.shouldUseTinderLayout()) {
      return tinderAnimatedStyles(
        index,
        animatedValue as Animated.Value,
        this.props,
        layoutCardOffset!
      );
    }
    if (this.shouldUseStackLayout()) {
      return stackAnimatedStyles(
        index,
        animatedValue as Animated.Value,
        this.props,
        layoutCardOffset!
      ); //Better error feedback is needed here - in case other layouts are used without the offset params
    }
    if (this.shouldUseShiftLayout()) {
      return shiftAnimatedStyles(
        index,
        animatedValue as Animated.Value,
        this.props
      );
    }
    return defaultAnimatedStyles(
      index,
      animatedValue as Animated.Value,
      this.props
    );
  }

  renderItem({ item, index }: Omit<ListRenderItemInfo<T>, "separators">) {
    const { interpolators } = this.state;
    const {
      hasParallaxImages,
      itemWidth,
      itemHeight,
      keyExtractor,
      renderItem,
      sliderHeight,
      sliderWidth,
      slideStyle,
      vertical
    } = this.props;

    const animatedValue = interpolators && interpolators[index];

    if (!animatedValue && animatedValue !== 0) {
      return null;
    }

    const animate = this.shouldAnimateSlides();
    const Component = animate ? Animated.View : View;
    const animatedStyle = animate
      ? this.getSlideInterpolatedStyle(index, animatedValue)
      : {};

    const parallaxProps = hasParallaxImages
      ? {
          scrollPosition: this.scrollPos,
          carouselRef: this.carouselRef,
          vertical,
          sliderWidth,
          sliderHeight,
          itemWidth,
          itemHeight
        }
      : undefined;
    const mainDimension = vertical
      ? { height: itemHeight }
      : { width: itemWidth };
    const specificProps = this.needsScrollView()
      ? {
          key: keyExtractor
            ? keyExtractor(item, index)
            : this.getKeyExtractor(index)
        }
      : {};

    return (
      <Component
        style={[mainDimension, slideStyle, animatedStyle]}
        pointerEvents={"box-none"}
        {...specificProps}
      >
        {renderItem({ item, index, parallaxProps: parallaxProps! })}
      </Component>
    );
  }

  getComponentOverridableProps() {
    const {
      enableMomentum,
      itemWidth,
      itemHeight,
      loopClonesPerSide,
      sliderWidth,
      sliderHeight,
      vertical
    } = this.props;

    const visibleItems =
      Math.ceil(
        vertical ? sliderHeight / itemHeight : sliderWidth / itemWidth
      ) + 1;
    const initialNumPerSide = this.enableLoop() ? loopClonesPerSide : 2;
    const initialNumToRender = visibleItems + initialNumPerSide * 2;
    const maxToRenderPerBatch = 1 + initialNumToRender * 2;
    const windowSize = maxToRenderPerBatch;

    const specificProps = !this.needsScrollView()
      ? {
          initialNumToRender: initialNumToRender,
          maxToRenderPerBatch: maxToRenderPerBatch,
          windowSize: windowSize
          // updateCellsBatchingPeriod
        }
      : {};

    return {
      decelerationRate: enableMomentum ? 0.9 : "fast",
      showsHorizontalScrollIndicator: false,
      showsVerticalScrollIndicator: false,
      overScrollMode: "never",
      automaticallyAdjustContentInsets: false,
      directionalLockEnabled: true,
      pinchGestureEnabled: false,
      scrollsToTop: false,
      removeClippedSubviews: !this.needsScrollView(),
      inverted: this.needsRTLAdaptations(),
      // renderToHardwareTextureAndroid: true,
      ...specificProps
    };
  }

  getComponentStaticProps() {
    const { hideCarousel } = this.state;
    const {
      containerCustomStyle,
      contentContainerCustomStyle,
      keyExtractor,
      sliderWidth,
      sliderHeight,
      style,
      vertical
    } = this.props;

    const containerStyle = [
      containerCustomStyle || style || {},
      hideCarousel ? { opacity: 0 } : {},
      vertical
        ? { height: sliderHeight, flexDirection: "column" }
        : // LTR hack; see https://github.com/facebook/react-native/issues/11960
          // and https://github.com/facebook/react-native/issues/13100#issuecomment-328986423
          {
            width: sliderWidth,
            flexDirection: this.needsRTLAdaptations() ? "row-reverse" : "row"
          }
    ];
    const contentContainerStyle = [
      vertical
        ? {
            paddingTop: this.getContainerInnerMargin(),
            paddingBottom: this.getContainerInnerMargin(true)
          }
        : {
            paddingLeft: this.getContainerInnerMargin(),
            paddingRight: this.getContainerInnerMargin(true)
          },
      contentContainerCustomStyle || {}
    ];

    const specificProps = !this.needsScrollView()
      ? {
          // extraData: this.state,
          renderItem: this.renderItem,
          numColumns: 1,
          getItemLayout: undefined, // see #193
          initialScrollIndex: undefined, // see #193
          keyExtractor: keyExtractor || this.getKeyExtractor
        }
      : {};

    return {
      ref: (c: FlatList<T>) => (this.carouselRef = c),
      data: this.getCustomData(),
      style: containerStyle,
      contentContainerStyle: contentContainerStyle,
      horizontal: !vertical,
      scrollEventThrottle: 1,
      onScroll: this.onScrollHandler,
      onScrollBeginDrag: this.onScrollBeginDrag,
      onScrollEndDrag: this.onScrollEndDrag,
      onMomentumScrollEnd: this.onMomentumScrollEnd,
      onResponderRelease: this.onTouchRelease,
      onStartShouldSetResponderCapture: this.onStartShouldSetResponderCapture,
      onTouchStart: this.onTouchStart,
      onTouchEnd: this.onScrollEnd,
      onLayout: this.onLayout,
      ...specificProps
    };
  }

  render() {
    const { data, renderItem, useScrollView } = this.props;

    if (!data || !renderItem) {
      return null;
    }

    const props = {
      ...this.getComponentOverridableProps(),
      ...this.props,
      ...this.getComponentStaticProps()
    };

    const ScrollViewComponent =
      typeof useScrollView === "function" ? useScrollView : AnimatedScrollView;
    return this.needsScrollView() ? (
      <ScrollViewComponent {...props}>
        {this.getCustomData().map((item, index) => {
          return this.renderItem({ item, index });
        })}
      </ScrollViewComponent>
    ) : (
      <AnimatedFlatList {...props} />
    );
  }
}
