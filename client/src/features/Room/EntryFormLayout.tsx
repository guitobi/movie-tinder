import { LoaderCircle, Sparkles, User } from "lucide-react";
import type { FormEvent, ReactNode } from "react";

interface EntryFormLayoutProps {
  title: string;
  subtitle: string;
  footerText: string;
  submitLabel: string;
  loadingLabel?: string;
  errorMessage: string;
  isLoading: boolean;
  isSubmitDisabled: boolean;
  onClose?: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}

const EntryFormLayout = ({
  title,
  subtitle,
  footerText,
  submitLabel,
  loadingLabel = submitLabel,
  errorMessage,
  isLoading,
  isSubmitDisabled,
  onClose,
  onSubmit,
  children,
}: EntryFormLayoutProps) => {
  return (
    <>
      <div className="mb-4 flex justify-center sm:mb-6">
        <div className="rounded-full bg-linear-to-br from-purple-600 to-pink-600 p-3 glow-effect-pink animate-pulse-glow sm:p-4">
          <User className="h-8 w-8 text-white sm:h-10 sm:w-10" />
        </div>
      </div>

      <div className="mb-5 text-center sm:mb-6 md:mb-8">
        <h2 className="mb-2 flex items-center justify-center gap-2 text-2xl font-bold text-white sm:text-3xl">
          {title}
          <Sparkles className="h-5 w-5 text-yellow-400 sm:h-6 sm:w-6" />
        </h2>
        <p className="text-sm text-slate-400 sm:text-base">{subtitle}</p>
      </div>

      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-4 sm:gap-5 md:gap-6"
      >
        {children}

        {errorMessage && (
          <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {errorMessage}
          </p>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <button
            type="button"
            onClick={() => onClose?.()}
            className="flex-1 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-300 transition-all duration-300 hover:bg-slate-700 sm:px-6 sm:py-3 sm:text-base"
          >
            Скасувати
          </button>
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 px-4 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:scale-105 hover:from-purple-500 hover:to-pink-500 disabled:transform-none disabled:cursor-not-allowed disabled:from-slate-700 disabled:to-slate-700 disabled:shadow-none glow-effect-pink sm:px-6 sm:py-3 sm:text-base"
          >
            {isLoading ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin sm:h-5 sm:w-5" />
                {loadingLabel}
              </>
            ) : (
              <>
                {submitLabel}
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
              </>
            )}
          </button>
        </div>
      </form>

      <p className="mt-4 text-center text-xs text-slate-500 sm:mt-5 md:mt-6">
        {footerText}
      </p>
    </>
  );
};

export default EntryFormLayout;
