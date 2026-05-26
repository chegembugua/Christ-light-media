interface FormErrorProps {
  message: string;
}

export function FormError({ message }: FormErrorProps) {
  return (
    <div className="mb-6 animate-fadeUp rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs font-bold text-red-500">
      {message}
    </div>
  );
}
