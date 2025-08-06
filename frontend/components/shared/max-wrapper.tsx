import { cn } from "@/lib/utils";
import { MaxWrapperTypes } from "@/types";
import React, { FC } from "react";

const MaxWrapper: FC<MaxWrapperTypes> = ({
  children,
  className,
  as: Component = "div",
  ...props
}) => {
  return (
    <Component className={cn("mx-auto", className)} {...props}>
      {children}
    </Component>
  );
};

export default MaxWrapper;
