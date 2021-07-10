import React from "react";
import { G, Path, Svg, Defs, ClipPath } from "react-native-svg";

// Each nameValuePair can be:
// * Name: <Svg />; or
// * Name: { svg: <Svg />, viewBox: '0 0 50 50' }

export default {
  home: (
    <Svg width={76} height={49} viewBox="0 0 76 49">
      <Defs>
        <ClipPath id="prefix__a">
          <Path
            d="M0 0h76v49H0z"
            transform="translate(1 582)"
            fill="none"
            stroke="#707070"
          />
        </ClipPath>
      </Defs>
      <G
        data-name="Mask Group 607"
        transform="translate(-1 -582)"
        clipPath="url(#prefix__a)"
      >
        <Path
          data-name="Path 5154"
          d="M40.516 589.639L26.5 600.684l1.9 2.256 1.545-1.181s1.838 9.793 1.838 11.827h17.363c-.008-1.981 1.83-11.722 1.83-11.722l1.069.837 2.014-2.262zm-.24 15.952a3.407 3.407 0 113.407-3.407 3.408 3.408 0 01-3.407 3.407z"
          fill="none"
          stroke="#2c2d2e"
        />
      </G>
    </Svg>
  ),
  tickets: (
    <Svg width={76} height={49} viewBox="0 0 76 49">
      <Path
        data-name="Path 17"
        d="M49.792 20.017l-10.8-10.35A2.439 2.439 0 0037.3 9h-8.4a2.359 2.359 0 00-2.4 2.3v8.05a2.248 2.248 0 00.708 1.633l10.8 10.35A2.439 2.439 0 0039.7 32a2.4 2.4 0 001.692-.679l8.4-8.05a2.2 2.2 0 00.708-1.621 2.275 2.275 0 00-.708-1.633zM30.7 14.75a1.761 1.761 0 01-1.8-1.725 1.761 1.761 0 011.8-1.725 1.761 1.761 0 011.8 1.725 1.761 1.761 0 01-1.8 1.725z"
        fill="none"
        stroke="#2c2d2e"
      />
      <Path d="M0 0h76v49H0z" fill="none" />
    </Svg>
  ),
  notifications: (
    <Svg width={76} height={49} viewBox="0 0 76 49">
      <G data-name="Group 900">
        <G data-name="Group 899">
          <Path
            data-name="Path 322"
            d="M47 25.717h0c0 1.006-.809 1.072-1.806 1.072h-14.63c-1 0-1.806-.066-1.806-1.072v-.173a1.818 1.818 0 011.027-1.637l.573-4.989a7.57 7.57 0 015.974-7.421V9.559a1.547 1.547 0 113.094 0v1.937a7.569 7.569 0 015.974 7.421l.573 4.99A1.817 1.817 0 0147 25.543z"
            fill="none"
            stroke="#2c2d2e"
          />
        </G>
      </G>
      <Path
        data-name="Path 323"
        d="M37.879 32h-.147a2.678 2.678 0 01-2.552-2.717h5.4a2.8 2.8 0 01-1.819 2.573 2.32 2.32 0 01-.882.144z"
        fill="none"
        stroke="#2c2d2e"
      />
      <Path d="M0 0h76v49H0z" fill="none" />
    </Svg>
  ),
  profile: (
    <Svg width={512} height={512} viewBox="0 0 76 49">
      <Path
        fill="none"
        stroke="#000"
        strokeWidth={10.449}
        d="M256.041 259.388c40.862-.049 73.974-33.161 74.023-74.018v-12.357c0-40.882-33.14-74.023-74.023-74.023s-74.023 33.141-74.023 74.023v12.33c.036 40.871 33.153 73.996 74.018 74.044h.005zM346.448 296.187c-27.091-7.656-58.202-12.058-90.342-12.058s-63.251 4.401-92.766 12.635l2.423-.577c-26.341 7.472-45.333 31.262-45.438 59.505v39.434h271.454v-39.421c-.091-28.228-19.034-52.006-44.894-59.409l-.438-.107z"
      />
    </Svg>
  )
};
