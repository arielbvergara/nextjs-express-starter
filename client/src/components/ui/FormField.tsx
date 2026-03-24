import { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  required?: boolean;
  optional?: boolean;
  children: ReactNode;
}

export function FormField({ label, required, optional, children }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{" "}
        {required && <span className="text-red-500">*</span>}
        {optional && <span className="text-gray-400 font-normal">(optional)</span>}
      </label>
      {children}
    </div>
  );
}
