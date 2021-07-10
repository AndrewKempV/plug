export const createPropsGetter = <DP extends object>(defaultProps: DP) => {
  return <P extends Partial<DP>>(props: P) => {
    type PropsExcludingDefaults = Pick<P, Exclude<keyof P, keyof DP>>;
    type RecomposedProps = DP & PropsExcludingDefaults;
    return (props as any) as RecomposedProps;
  };
};
// tslint:disable-next-line:ban-types
export const isFunction = <T extends Function>(value: any): value is T =>
  typeof value === "function";
