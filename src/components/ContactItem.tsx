import { ReactNode } from "react";

const ContactItem = ({
  children,
  isEmail,
  href,
  className,
}: {
  children: ReactNode;
  href: string;
  isEmail?: boolean;
  className?: string;
}) => {
  return (
    <a target="_blank" rel="noreferrer" href={isEmail ? `mailto:${href}` : href} className="w-fit">
      <span className={`px-1 text-xs hover:text-BLACK dark:hover:text-white ${className}`}>
        {children}
      </span>
    </a>
  );
};

export default ContactItem;
