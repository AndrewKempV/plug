import { StyleSheet } from 'react-native'
import _ from 'lodash';
// import merge from 'merge';
// import assign from 'object-assign';

export function randomHexColor() {
  return '#'+('00000'+(Math.random()*16777216<<0).toString(16)).substr(-6);
};

export function createDebugStylesheet(debugOptions) {
  return {
    create: (styleObject) => {
      for (var styleClass in styleObject) {

        var propertiesForStyleClass = {};
        for (var debugProperty in debugOptions) {

          // Apply the function to get a value unique to this styleClass for the property
          if (typeof debugOptions[debugProperty] == 'function') {
            var value = debugOptions[debugProperty].call(this, styleClass, debugProperty, styleObject[styleClass][debugProperty]);

            if (value != null && (typeof value !== 'undefined')) {
              propertiesForStyleClass[debugProperty] = value;
            }
          // Otherwise just set the value
          } else {
            propertiesForStyleClass[debugProperty] = debugOptions[debugProperty];
          }
        }

        styleObject[styleClass] = _.merge(styleObject[styleClass], propertiesForStyleClass);
      }

      return StyleSheet.create(styleObject);
    }
  }
}

export const DefaultDebugStylesheet = createDebugStylesheet({borderColor: randomHexColor, borderWidth: 1});

export default Object.assign(
  DefaultDebugStylesheet, {
    Borders: DefaultDebugStylesheet,
    Backgrounds: createDebugStylesheet({ backgroundColor: randomHexColor, opacity: 0.85 }),
    createDebugStylesheet: createDebugStylesheet,
    randomHexColor: randomHexColor 
  }
)