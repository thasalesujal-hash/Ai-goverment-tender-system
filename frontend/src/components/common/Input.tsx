import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  editing: boolean;
}

export function Input({ label, editing, value, onChange, ...props }: InputProps) {
  if (!editing) {
    return (
      <div>
        <label className="block text-sm font-medium text-slate-700">{label}</label>
        <p className="mt-1 text-sm text-slate-900">{value as string}</p>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <input
        value={value as string}
        onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...props}
      />
    </div>
  );
}
