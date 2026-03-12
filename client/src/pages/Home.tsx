import { Popcorn, Film, Sparkles, Users } from "lucide-react";
import CreateRoomForm from "../features/Room/CreateRoomForm";
import JoinRoomForm from "../features/Room/JoinRoomForm";
import Modal from "../ui/Modal";

const Home = () => {
  return (
    <Modal>
      <div className="min-h-screen flex flex-col justify-center items-center gap-6 sm:gap-8 px-4 relative overflow-hidden">
        <div className="absolute top-10 sm:top-20 left-4 sm:left-20 text-purple-500/10 animate-float">
          <Film className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28" />
        </div>
        <div
          className="absolute bottom-10 sm:bottom-20 right-4 sm:right-20 text-pink-500/10 animate-float"
          style={{ animationDelay: "1s" }}
        >
          <Popcorn className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24" />
        </div>
        <div
          className="absolute top-1/2 left-2 sm:left-10 text-purple-400/10 animate-float"
          style={{ animationDelay: "2s" }}
        >
          <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6 sm:gap-8 max-w-2xl w-full">
          <div className="flex flex-col items-center gap-3 sm:gap-4 animate-float">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-linear-to-br from-purple-600 to-pink-600 rounded-xl sm:rounded-2xl glow-effect">
                <Popcorn className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
              </div>
            </div>
            <h1 className="flex flex-row items-center text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-pink-400 to-purple-400 font-black text-4xl sm:text-5xl md:text-6xl gap-2 sm:gap-3">
              MovieMatch
              <Sparkles className="text-yellow-400 animate-pulse-glow w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
            </h1>
            <p className="text-slate-400 text-sm sm:text-base md:text-lg text-center max-w-md px-4">
              Знайдіть ідеальний фільм для перегляду разом з друзями
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 w-full mb-4">
            <div className="movie-card p-4 sm:p-6 text-center group">
              <Users className="mx-auto mb-2 sm:mb-3 text-purple-400 group-hover:text-pink-400 transition-colors w-6 h-6 sm:w-8 sm:h-8" />
              <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                Створіть кімнату
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm">
                Запросіть друзів
              </p>
            </div>
            <div className="movie-card p-4 sm:p-6 text-center group">
              <Film className="mx-auto mb-2 sm:mb-3 text-purple-400 group-hover:text-pink-400 transition-colors w-6 h-6 sm:w-8 sm:h-8" />
              <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                Вибирайте фільми
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm">
                Свайпайте як в Tinder
              </p>
            </div>
            <div className="movie-card p-4 sm:p-6 text-center group">
              <Sparkles className="mx-auto mb-2 sm:mb-3 text-purple-400 group-hover:text-pink-400 transition-colors w-6 h-6 sm:w-8 sm:h-8" />
              <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                Знайдіть збіг
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm">
                Дивіться разом!
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Modal.Open opens="create">
              <button className="group relative w-full overflow-hidden rounded-xl bg-linear-to-r from-purple-600 to-pink-600 px-6 py-3 text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:from-purple-500 hover:to-pink-500 glow-effect-pink sm:w-auto sm:rounded-2xl sm:px-10 sm:py-4 sm:text-xl md:px-12 md:text-2xl">
                <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                  Створити кімнату
                  <Users className="w-5 h-5 transition-transform group-hover:rotate-12 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-pink-600 to-purple-600 opacity-0 transition-opacity group-hover:opacity-100"></div>
              </button>
            </Modal.Open>

            <Modal.Open opens="join">
              <button className="w-full rounded-xl border border-purple-500/30 bg-slate-900/70 px-6 py-3 text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:border-pink-500/40 hover:bg-slate-800/80 sm:w-auto sm:rounded-2xl sm:px-10 sm:py-4 sm:text-xl md:px-12 md:text-2xl">
                Приєднатись по коду
              </button>
            </Modal.Open>
          </div>

          <p className="text-slate-500 text-xs sm:text-sm text-center px-4">
            Швидко, безкоштовно та без реєстрації
          </p>
        </div>

        <Modal.Window name="create">
          <CreateRoomForm />
        </Modal.Window>

        <Modal.Window name="join">
          <JoinRoomForm />
        </Modal.Window>
      </div>
    </Modal>
  );
};
export default Home;
