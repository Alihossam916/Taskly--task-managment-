import Link from "next/link";
import { Fragment } from "react";

export interface BreadCrumbItem {
  label?: string;
  href?: string;
}

interface BreadCrumbProps {
  items: BreadCrumbItem[];
}

const BreadCrumb = ({ items }: BreadCrumbProps) => {
  return (
    <div className="hidden sm:flex items-center gap-2">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <Fragment key={index}>
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="uppercase label-sm text-slate-2"
              >
                {item.label}
              </Link>
            ) : (
              <p
                className={`uppercase label-sm ${
                  isLast ? "text-primary" : "text-slate-2"
                }`}
              >
                {item.label}
              </p>
            )}
            {!isLast && <span className="text-slate-1">{">"}</span>}
          </Fragment>
        );
      })}
    </div>
  );
};

export default BreadCrumb;
