"use client";

import Image from "next/image";
import * as React from "react";
import Link from "next/link";

type DockItemBase = {
  label: string;
  active?: boolean;
  imageSrc?: string;
  className?: string;
  children?: React.ReactNode;
};

type DockItemButtonProps = DockItemBase &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type DockItemLinkProps = DockItemBase &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type DockItemProps = DockItemButtonProps | DockItemLinkProps;

const DockItem = React.forwardRef<HTMLButtonElement, DockItemProps>(
  (props, ref) => {
    const { label, imageSrc, className, children } = props;
    
    const wrapperContent = (
      <div
        className={[
          "relative overflow-hidden size-12 rounded-xl grid place-items-center shadow-md backdrop-blur",
          "transition-transform duration-200 ease-out",
          "hover:scale-[1.05] active:scale-95",
          className ?? "",
        ].join(" ")}
      >
        {children ? (
          children
        ) : imageSrc ? (
          <Image
            src={imageSrc}
            alt={label}
            fill
            className="rounded-xl object-cover"
          />
        ) : null}
      </div>
    );

    if ("href" in props && props.href) {
      const {
        href,
        label: _label,
        imageSrc: _imageSrc,
        className: _className,
        children: _children,
        active: _active,
        ...anchorProps
      } = props as DockItemLinkProps;
      return (
        <Link href={href} className="group relative" {...anchorProps}>
          {wrapperContent}
        </Link>
      );
    }

    const {
      label: _label,
      imageSrc: _imageSrc,
      className: _className,
      children: _children,
      active: _active,
      ...buttonDomProps
    } = props as DockItemButtonProps;
    
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        title={label}
        aria-label={label}
        className="group relative"
        {...buttonDomProps}
      >
        {wrapperContent}
      </button>
    );
  }
);

DockItem.displayName = "DockItem";

export default DockItem;
