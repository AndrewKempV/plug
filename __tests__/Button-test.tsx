import React from 'react';
import renderer from 'react-test-renderer';
import { BetterButton } from '../app/components/Button/Button';

test('Button renders correctly', () => {
  const onPress = jest.fn();
  const tree = renderer.create(<BetterButton label="Submit" onPress={onPress} />).toJSON();
  expect(tree).toMatchSnapshot();
});