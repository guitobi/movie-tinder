import { AlertCircle } from "lucide-react";

interface NetworkErrorProps {
  onRetry?: () => void;
}

const NetworkError = ({ onRetry }: NetworkErrorProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="movie-card p-6 sm:p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-rose-500/20 rounded-full">
            <AlertCircle className="w-12 h-12 text-rose-400" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Немає з'єднання з сервером
        </h1>
        <p className="text-slate-400 mb-6">
          Не вдалося підключитися до сервера. Перевірте інтернет-з'єднання або спробуйте пізніше.
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl px-6 py-3 transition-all duration-300 transform hover:scale-105 glow-effect-pink"
          >
            Спробувати ще раз
          </button>
        )}
      </div>
    </div>
  );
};

export default NetworkError;
