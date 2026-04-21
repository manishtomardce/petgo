type TagProps = {
    label: string;
    className?: string;
  };
  
  export default function Tag({ label, className = "" }: TagProps) {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-[#CF8750] ${className}`}
      >
        {label}
      </span>
    );
  }