import { Copy, Users, Play, Crown, Film, Link as LinkIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { Room, RootState } from "../types/types";
import socket from "../services/socket";
import { updateRoom } from "../store/slices/roomSlice";

const Room = () => {
  const [copied, setCopied] = useState(false);
  const dispatch = useDispatch();

  const roomId = useSelector((state: RootState) => state.room.id);
  const username = useSelector((state: RootState) => state.player.username);

  //mock data
  const players = [
    { id: 1, name: "Олександр", isHost: true, isReady: true },
    { id: 2, name: "Марія", isHost: false, isReady: true },
    { id: 3, name: "Іван", isHost: false, isReady: false },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const readyCount = players.filter((p) => p.isReady).length;
  const canStart = readyCount === players.length;

  useEffect(() => {
    socket.emit("create-room", { roomId, username });
    socket.on("room-updated", (room: Room) => {
      dispatch(updateRoom(room));
    });

    return () => {
      socket.off("room-updated");
    };
  }, [roomId, username, dispatch]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-3 sm:p-4 relative overflow-hidden">
      <div className="absolute top-5 sm:top-10 right-4 sm:right-10 text-purple-500/10 animate-float">
        <Film className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24" />
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        <div className="movie-card p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 text-center">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Users className="text-purple-400 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400">
              Кімната
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-3 sm:mb-4">
            <div className="bg-slate-900/50 px-4 sm:px-6 py-2 sm:py-3 rounded-xl border border-purple-500/30">
              <p className="text-slate-400 text-xs sm:text-sm mb-1">
                Код кімнати
              </p>
              <p className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-wider">
                #{roomId}
              </p>
            </div>
            <button
              onClick={handleCopy}
              className="p-2 sm:p-3 bg-purple-600 hover:bg-purple-500 rounded-xl transition-all duration-300 transform hover:scale-105 glow-effect group relative"
              title="Копіювати код"
            >
              {copied ? (
                <div className="text-white text-sm font-semibold">✓</div>
              ) : (
                <Copy className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-slate-400">
            <LinkIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            <p className="text-xs sm:text-sm">
              Поділіться цим кодом з друзями, щоб вони приєдналися
            </p>
          </div>
        </div>

        {/* Список гравців */}
        <div className="movie-card p-4 sm:p-6 md:p-8 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Users className="text-purple-400 w-5 h-5 sm:w-6 sm:h-6" />
              Учасники
              <span className="text-slate-500 text-base sm:text-lg">
                ({players.length})
              </span>
            </h2>
            <div className="text-xs sm:text-sm">
              <span className="text-slate-400">Готові: </span>
              <span className="text-purple-400 font-semibold">
                {readyCount}/{players.length}
              </span>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between bg-slate-900/50 p-3 sm:p-4 rounded-xl border border-purple-500/10 hover:border-purple-500/30 transition-all group"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center font-bold text-white text-base sm:text-lg glow-effect">
                    {player.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white font-semibold text-sm sm:text-base">
                        {player.name}
                      </p>
                      {player.isHost && (
                        <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-1.5 sm:px-2 py-0.5 rounded-full text-xs">
                          <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          <span>Господар</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  {player.isReady ? (
                    <div className="flex items-center gap-1.5 sm:gap-2 text-green-400">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs sm:text-sm font-semibold">
                        Готовий
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 sm:gap-2 text-slate-500">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-500 rounded-full"></div>
                      <span className="text-xs sm:text-sm">Очікує...</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Кнопки керування */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl px-4 sm:px-6 py-3 sm:py-4 transition-all duration-300 text-sm sm:text-base">
            Вийти з кімнати
          </button>
          <button
            disabled={!canStart}
            className="flex-1 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-xl px-4 sm:px-6 py-3 sm:py-4 transition-all duration-300 transform hover:scale-105 disabled:transform-none glow-effect-pink disabled:shadow-none flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            {canStart ? "Почати гру" : "Очікування гравців..."}
          </button>
        </div>

        {!canStart && (
          <p className="text-center text-slate-500 text-xs sm:text-sm mt-3 sm:mt-4 px-4">
            Всі учасники повинні бути готові, щоб почати
          </p>
        )}
      </div>
    </div>
  );
};
export default Room;
