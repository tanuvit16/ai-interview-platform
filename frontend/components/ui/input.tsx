// import { InputHTMLAttributes } from "react";

// interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
//   label?: string;
//   error?: string;
// }

// export default function Input({ label, error, className = "", ...props }: InputProps) {
//   return (
//     <div className="flex flex-col gap-1 w-full">
//       {label && <label className="text-sm text-gray-400 font-medium">{label}</label>}
//       <input
//         className={`bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors ${className}`}
//         {...props}
//       />
//       {error && <span className="text-red-400 text-xs">{error}</span>}
//     </div>
//   );
// }













// "use client";
// import { InputHTMLAttributes, ReactNode } from "react";

// interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
//   label?: string;
//   error?: string;
//   hint?: string;
//   icon?: ReactNode;
// }

// export default function Input({ label, error, hint, icon, className = "", ...props }: InputProps) {
//   return (
//     <div className="flex flex-col gap-1.5 w-full">
//       {label && (
//         <label className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
//           {label}
//         </label>
//       )}
//       <div className="relative">
//         {icon && <div className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40">{icon}</div>}
//         <input
//           className={`w-full rounded-[10px] px-4 py-2.5 text-sm outline-none transition-all duration-200 ${icon ? "pl-10" : ""} ${className}`}
//           style={{
//             background: 'var(--bg-elevated)',
//             border: `1px solid ${error ? 'rgba(239,68,68,0.4)' : 'var(--border)'}`,
//             color: 'var(--text-primary)',
//             fontFamily: 'var(--font-body)',
//           }}
//           onFocus={e => {
//             e.target.style.border = `1px solid ${error ? 'rgba(239,68,68,0.6)' : 'var(--border-accent)'}`;
//             e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.08)';
//           }}
//           onBlur={e => {
//             e.target.style.border = `1px solid ${error ? 'rgba(239,68,68,0.4)' : 'var(--border)'}`;
//             e.target.style.boxShadow = 'none';
//           }}
//           {...props}
//         />
//       </div>
//       {error && <span className="text-xs" style={{ color: 'var(--danger)' }}>{error}</span>}
//       {hint && !error && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{hint}</span>}
//     </div>
//   );
// }


















"use client";
import { InputHTMLAttributes, ReactNode, useRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
}

export default function Input({ label, error, hint, icon, className = "", style, ...props }: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      {label && (
        <label style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#4a5568',
        }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {icon && (
          <div style={{
            position: 'absolute', left: '13px', top: '50%',
            transform: 'translateY(-50%)', opacity: 0.4,
            display: 'flex', alignItems: 'center',
          }}>
            {icon}
          </div>
        )}
        <input
          ref={inputRef}
          className={className}
          style={{
            width: '100%',
            padding: icon ? '10px 14px 10px 40px' : '10px 14px',
            borderRadius: '10px',
            border: `1px solid ${error ? 'rgba(248,113,113,0.4)' : 'rgba(255,255,255,0.07)'}`,
            background: '#121820',
            color: '#eef2ff',
            fontSize: '14px',
            lineHeight: '1.5',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            fontFamily: 'inherit',
            ...style,
          }}
          onFocus={e => {
            e.target.style.borderColor = error ? 'rgba(248,113,113,0.6)' : 'rgba(99,102,241,0.6)';
            e.target.style.boxShadow = error
              ? '0 0 0 3px rgba(248,113,113,0.08)'
              : '0 0 0 3px rgba(99,102,241,0.08)';
          }}
          onBlur={e => {
            e.target.style.borderColor = error ? 'rgba(248,113,113,0.4)' : 'rgba(255,255,255,0.07)';
            e.target.style.boxShadow = 'none';
          }}
          {...props}
        />
      </div>
      {error && (
        <span style={{ fontSize: '12px', color: '#f87171' }}>{error}</span>
      )}
      {hint && !error && (
        <span style={{ fontSize: '12px', color: '#4a5568' }}>{hint}</span>
      )}
    </div>
  );
}