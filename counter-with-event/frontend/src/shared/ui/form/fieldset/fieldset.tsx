import { HTMLAttributes } from "react";
import clsx from "clsx";

type Props = HTMLAttributes<HTMLFieldSetElement> & {
  legend?: string;
};

const Fieldset = ({ legend, className, children, ...props }: Props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <fieldset className={className} {...props}>
    {legend && <legend className={""}>{legend}</legend>}
    {children}
  </fieldset>
);

export { Fieldset };
