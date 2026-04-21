type SectionHeadingProps = {
    title: string;
    subtitle?: string;
    align?: "left" | "center";
  };
  
  export default function SectionHeading({
    title,
    subtitle,
    align = "left",
  }: SectionHeadingProps) {
    const alignment = align === "center" ? "text-center" : "text-left";
  
    return (
      <div className={alignment}>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-2 text-sm leading-6 text-gray-600 sm:text-base">
            {subtitle}
          </p>
        ) : null}
      </div>
    );
  }