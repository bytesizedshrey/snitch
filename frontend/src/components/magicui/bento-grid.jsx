import { cn } from "../../lib/utils";

const BentoGrid = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[24rem] grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6",
        className
      )}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  children,
  onClick
}) => (
  <div
    onClick={onClick}
    className={cn(
      "group relative flex flex-col justify-between overflow-hidden rounded-[12px] cursor-pointer",
      // Custom Skeuomorphic Styles
      "bg-bento-card border border-bento-border shadow-bento transition-all duration-300",
      "hover:-translate-y-1 hover:shadow-bento dark:hover:shadow-bento",
      className
    )}
  >
    <div className="absolute inset-0 z-0">{background}</div>
    
    <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-5 transition-all duration-300 group-hover:-translate-y-10 bg-bento-card mt-auto border-t border-bento-border shadow-bento-sunken">
      {Icon && (
        <Icon className="mb-2 h-10 w-10 origin-left transform-gpu text-bento-text-faint transition-all duration-300 ease-in-out group-hover:scale-75" />
      )}
      <h3 className="text-[14px] md:text-[18px] font-semibold text-bento-text tracking-tight truncate">
        {name}
      </h3>
      <p className="max-w-lg text-[11px] md:text-[13px] text-bento-text-muted font-light leading-relaxed line-clamp-2 md:line-clamp-3">
        {description}
      </p>
    </div>

    <div
      className={cn(
        "pointer-events-none absolute bottom-0 z-20 flex w-full translate-y-10 transform-gpu flex-row items-center justify-between p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
      )}
    >
      <div className="w-full pointer-events-auto">
        {children}
      </div>
    </div>
    <div className="pointer-events-none absolute inset-0 z-30 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-black/[.10]" />
  </div>
);

export { BentoCard, BentoGrid };
