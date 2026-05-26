'use client';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  ...props 
}: ButtonProps) {
  const base = "font-medium transition-all duration-300 rounded-xl flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-white text-black hover:bg-gray-200",
    secondary: "bg-[#1A1A1A] border border-gray-700 hover:border-gray-600 text-white",
    ghost: "hover:bg-white/10 text-white",
    gold: "bg-[#C8A24A] text-black hover:bg-[#B38A3D] font-semibold"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button 
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
