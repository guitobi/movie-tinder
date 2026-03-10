import { X, User, Sparkles } from "lucide-react";
import { useState } from "react";

interface UserNameInputProps {
  onClose: () => void;
}

const UserNameInput: React.FC<UserNameInputProps> = ({ onClose }) => {
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      // Тут буде логіка для збереження імені
      console.log("Username:", username);
      onClose();
    }
  };

  return (
    <div className="inset-0 backdrop-blur-2xl bg-black/50 fixed flex justify-center items-center z-50 px-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md movie-card p-8 shadow-2xl glow-effect transform animate-in zoom-in-95 duration-300">
        {/* Кнопка закриття */}
        <button
          onClick={() => onClose()}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-700/50 transition-colors group"
          aria-label="Close"
        >
          <X
            className="text-slate-400 group-hover:text-white transition-colors"
            size={24}
          />
        </button>

        {/* Іконка */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-linear-to-br from-purple-600 to-pink-600 rounded-full glow-effect-pink animate-pulse-glow">
            <User size={40} className="text-white" />
          </div>
        </div>

        {/* Заголовок */}
        <div className="text-center mb-8">
          <h2 className="text-white font-bold text-3xl mb-2 flex items-center justify-center gap-2">
            Вітаємо!
            <Sparkles className="text-yellow-400" size={24} />
          </h2>
          <p className="text-slate-400">Введіть ваш нікнейм, щоб продовжити</p>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="relative">
            <label
              htmlFor="username"
              className="block text-slate-300 font-semibold mb-2 text-sm"
            >
              Нікнейм
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                size={20}
              />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900/50 border border-purple-500/20 text-white px-4 py-3 pl-11 rounded-xl focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder:text-slate-500"
                placeholder="Введіть ваш нікнейм..."
                autoFocus
                maxLength={20}
              />
            </div>
            {username && (
              <p className="text-slate-500 text-xs mt-1">
                {username.length}/20 символів
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onClose()}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl px-6 py-3 transition-all duration-300"
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={!username.trim()}
              className="flex-1 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-xl px-6 py-3 transition-all duration-300 transform hover:scale-105 disabled:transform-none glow-effect-pink disabled:shadow-none flex items-center justify-center gap-2"
            >
              Продовжити
              <Sparkles size={18} />
            </button>
          </div>
        </form>

        {/* Підказка */}
        <p className="text-slate-500 text-xs text-center mt-6">
          Ваш нікнейм буде видно іншим учасникам кімнати
        </p>
      </div>
    </div>
  );
};
export default UserNameInput;
