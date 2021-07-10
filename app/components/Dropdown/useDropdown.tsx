import { sequenceT } from "fp-ts/lib/Apply";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import React, { useCallback, useMemo, useRef } from "react";
import { TouchableOpacity } from "react-native";

import DropdownMenu, {
  Handler as DropdownMenuHandler,
  StyleProps,
  Option
} from "./Dropdown";

export interface UseDropdownMenuPayload {
  options: Option[];
  selectedId: string;
  direction?: "above" | "below";
  styles?: StyleProps;
}
export const useDropdownMenu = ({
  options,
  selectedId,
  direction = "below",
  styles
}: UseDropdownMenuPayload) => {
  const buttonRef = useRef<TouchableOpacity>(null);
  const menuRef = useRef<DropdownMenuHandler>(null);

  const toggle = useCallback(
    () =>
      pipe(
        sequenceT(O.option)(
          O.fromNullable(buttonRef.current),
          O.fromNullable(menuRef.current)
        ),
        O.map(([button, menu]) => {
          button.measureInWindow((x, y, width, height) =>
            menu.showFrom({ x, y, width, height })
          );
        })
      ),
    [buttonRef, menuRef]
  );

  const menu = useMemo(
    () => (
      <DropdownMenu
        ref={menuRef}
        options={options}
        selectedId={selectedId}
        direction={direction}
        {...styles}
      />
    ),
    [options, selectedId, direction, styles]
  );
  return {
    buttonRef,
    menu,
    toggle
  };
};
