// import { ButtonHTMLAttributes } from "react";

// interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
//   variant?: "primary" | "secondary" | "danger" | "ghost";
//   loading?: boolean;
// }

// export default function Button({ children, variant = "primary", loading, className = "", ...props }: ButtonProps) {
//   const base = "px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 cursor-pointer";
//   const variants = {
//     primary: "bg-blue-600 hover:bg-blue-700 text-white",
//     secondary: "bg-gray-700 hover:bg-gray-600 text-white",
//     danger: "bg-red-600 hover:bg-red-700 text-white",
//     ghost: "bg-transparent hover:bg-gray-800 text-gray-300 border border-gray-600",
//   };
//   return (
//     <button className={`${base} ${variants[variant]} ${className}`} disabled={loading || props.disabled} {...props}>
//       {loading ? "Loading..." : children}
//     </button>
//   );
// }





















// "use client";
// import { ButtonHTMLAttributes, ReactNode } from "react";

// interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
//   variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
//   size?: "sm" | "md" | "lg";
//   loading?: boolean;
//   icon?: ReactNode;
// }

// export default function Button({
//   children, variant = "primary", size = "md",
//   loading, icon, className = "", ...props
// }: ButtonProps) {
//   const sizes: any = {
//     sm: "px-3 py-1.5 text-xs gap-1.5",
//     md: "px-4 py-2 text-sm gap-2",
//     lg: "px-6 py-3 text-base gap-2.5",
//   };
//   const variants: any = {
//     primary: "bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500/50 hover:border-indigo-400/50 shadow-[0_0_20px_rgba(99,102,241,0.25)] hover:shadow-[0_0_28px_rgba(99,102,241,0.4)]",
//     secondary: "bg-[#1a2332] hover:bg-[#1f2b3e] text-[#f0f4ff] border border-white/8 hover:border-white/14 shadow-[0_2px_8px_rgba(0,0,0,0.4)]",
//     ghost: "bg-transparent hover:bg-white/5 text-[#8892a4] hover:text-[#f0f4ff] border border-transparent hover:border-white/8",
//     danger: "bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40",
//     success: "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/40",
//   };
//   return (
//     <button
//       className={`inline-flex items-center justify-center font-medium rounded-[10px] transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97] ${sizes[size]} ${variants[variant]} ${className}`}
//       disabled={loading || props.disabled}
//       {...props}
//     >
//       {loading ? (
//         <>
//           <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
//           <span>Loading...</span>
//         </>
//       ) : (
//         <>
//           {icon && <span className="shrink-0">{icon}</span>}
//           {children}
//         </>
//       )}
//     </button>
//   );
// }



















"use client";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: ReactNode;
}

export default function Button({
  children, variant = "primary", size = "md",
  loading, icon, className = "", ...props
}: ButtonProps) {

  const base = `
    inline-flex items-center justify-center font-medium
    rounded-xl transition-all duration-200 cursor-pointer
    disabled:opacity-40 disabled:cursor-not-allowed
    select-none outline-none active:scale-[0.97]
  `;

  const sizes: Record<string, string> = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5 rounded-lg",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3.5 text-[15px] gap-2.5",
  };

  const variants: Record<string, string> = {
    primary: `
      text-white font-semibold
      bg-indigo-600 hover:bg-indigo-500
      border border-indigo-500/60 hover:border-indigo-400
      shadow-[0_0_0_1px_rgba(99,102,241,0.2),0_4px_16px_rgba(99,102,241,0.3)]
      hover:shadow-[0_0_0_1px_rgba(99,102,241,0.3),0_4px_24px_rgba(99,102,241,0.45)]
    `,
    secondary: `
      text-[#eef2ff] bg-[#161d28] hover:bg-[#1c2535]
      border border-white/8 hover:border-white/14
      shadow-[0_2px_8px_rgba(0,0,0,0.3)]
    `,
    ghost: `
      text-[#8b95a8] hover:text-[#eef2ff]
      bg-transparent hover:bg-white/5
      border border-transparent hover:border-white/8
    `,
    danger: `
      text-red-400 hover:text-red-300
      bg-red-500/8 hover:bg-red-500/15
      border border-red-500/20 hover:border-red-500/35
    `,
    success: `
      text-emerald-400 hover:text-emerald-300
      bg-emerald-500/8 hover:bg-emerald-500/15
      border border-emerald-500/20 hover:border-emerald-500/35
    `,
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}