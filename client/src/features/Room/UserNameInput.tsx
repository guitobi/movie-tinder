import { User } from "lucide-react";

interface UserNameInputProps {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
}

const UserNameInput = ({ inputId, value, onChange }: UserNameInputProps) => {
  return (
    <div className="relative">
      <label
        htmlFor={inputId}
        className="mb-2 block text-xs font-semibold text-slate-300 sm:text-sm"
      >
        Нікнейм
      </label>
      <div className="relative">
        <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500 sm:h-5 sm:w-5" />
        <input
          type="text"
          id={inputId}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border border-purple-500/20 bg-slate-900/50 px-3 py-2.5 pl-10 text-sm text-white transition-all placeholder:text-slate-500 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none sm:px-4 sm:py-3 sm:pl-11 sm:text-base"
          placeholder="Введіть ваш нікнейм..."
          autoFocus
          maxLength={20}
        />
      </div>
      {value && (
        <p className="mt-1 text-xs text-slate-500">
          {value.length}/20 символів
        </p>
      )}
    </div>
  );
};

export default UserNameInput;
