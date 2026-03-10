import { Popcorn, Film, Sparkles, Users } from "lucide-react";
import { useState } from "react";
import UserNameInput from "../features/Room/UserNameInput";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onOpenModal = () => {
    setIsModalOpen((cur) => !cur);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-8 px-4 relative overflow-hidden">
      {/* Декоративні елементи */}
      <div className="absolute top-20 left-20 text-purple-500/10 animate-float">
        <Film size={120} />
      </div>
      <div
        className="absolute bottom-20 right-20 text-pink-500/10 animate-float"
        style={{ animationDelay: "1s" }}
      >
        <Popcorn size={100} />
      </div>
      <div
        className="absolute top-1/2 left-10 text-purple-400/10 animate-float"
        style={{ animationDelay: "2s" }}
      >
        <Sparkles size={80} />
      </div>

      {/* Основний контент */}
      <div className="relative z-10 flex flex-col items-center gap-8 max-w-2xl">
        {/* Логотип */}
        <div className="flex flex-col items-center gap-4 animate-float">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-linear-to-br from-purple-600 to-pink-600 rounded-2xl glow-effect">
              <Popcorn size={48} className="text-white" />
            </div>
          </div>
          <h1 className="flex flex-row items-center text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-pink-400 to-purple-400 font-black text-6xl whitespace-nowrap gap-3">
            MovieMatch
            <Sparkles
              className="text-yellow-400 animate-pulse-glow"
              size={40}
            />
          </h1>
          <p className="text-slate-400 text-lg text-center max-w-md">
            Знайдіть ідеальний фільм для перегляду разом з друзями
          </p>
        </div>

        {/* Фічі */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-4">
          <div className="movie-card p-6 text-center group">
            <Users
              className="mx-auto mb-3 text-purple-400 group-hover:text-pink-400 transition-colors"
              size={32}
            />
            <h3 className="text-white font-semibold mb-2">Створіть кімнату</h3>
            <p className="text-slate-400 text-sm">Запросіть друзів</p>
          </div>
          <div className="movie-card p-6 text-center group">
            <Film
              className="mx-auto mb-3 text-purple-400 group-hover:text-pink-400 transition-colors"
              size={32}
            />
            <h3 className="text-white font-semibold mb-2">Вибирайте фільми</h3>
            <p className="text-slate-400 text-sm">Свайпайте як в Tinder</p>
          </div>
          <div className="movie-card p-6 text-center group">
            <Sparkles
              className="mx-auto mb-3 text-purple-400 group-hover:text-pink-400 transition-colors"
              size={32}
            />
            <h3 className="text-white font-semibold mb-2">Знайдіть збіг</h3>
            <p className="text-slate-400 text-sm">Дивіться разом!</p>
          </div>
        </div>

        {/* Кнопка */}
        <button
          onClick={onOpenModal}
          className="group relative bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-2xl px-12 py-4 text-2xl transition-all duration-300 transform hover:scale-105 glow-effect-pink overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-3">
            Створити кімнату
            <Users
              size={28}
              className="group-hover:rotate-12 transition-transform"
            />
          </span>
          <div className="absolute inset-0 bg-linear-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>

        <p className="text-slate-500 text-sm text-center">
          Швидко, безкоштовно та без реєстрації
        </p>
      </div>

      {isModalOpen && <UserNameInput onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};
export default Home;
