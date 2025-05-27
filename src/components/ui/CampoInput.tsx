import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CampoInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}

export function CampoInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "number",
}: CampoInputProps) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="dark:bg-verde-escuro shadow-md shadow-zinc-800 border border-zinc-600 dark:border-zinc-800"
      />
    </div>
  );
}
