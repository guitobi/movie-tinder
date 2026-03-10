import { Copy, Users, Play, Crown, Film, Link as LinkIcon } from "lucide-react";
import { useState } from "react";

const Room = () => {
  const [copied, setCopied] = useState(false);
  const roomCode = "1212";
  const players = [
    { id: 1, name: "Олександр", isHost: true, isReady: true },
    { id: 2, name: "Марія", isHost: false, isReady: true },
    { id: 3, name: "Іван", isHost: false, isReady: false },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const readyCount = players.filter((p) => p.isReady).length;
  const canStart = readyCount === players.length;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Декоративні елементи */}
      <div className="absolute top-10 right-10 text-purple-500/10 animate-float">
        <Film size={100} />
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        {/* Заголовок з кодом кімнати */}
        <div className="movie-card p-8 mb-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="text-purple-400" size={32} />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400">
              Кімната
            </h1>
          </div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-slate-900/50 px-6 py-3 rounded-xl border border-purple-500/30">
              <p className="text-slate-400 text-sm mb-1">Код кімнати</p>
              <p className="text-3xl font-mono font-bold text-white tracking-wider">
                #{roomCode}
              </p>
            </div>
            <button
              onClick={handleCopy}
              className="p-3 bg-purple-600 hover:bg-purple-500 rounded-xl transition-all duration-300 transform hover:scale-105 glow-effect group relative"
              title="Копіювати код"
            >
              {copied ? (
                <div className="text-white text-sm font-semibold">✓</div>
              ) : (
                <Copy size={20} className="text-white" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-slate-400">
            <LinkIcon size={16} />
            <p className="text-sm">
              Поділіться цим кодом з друзями, щоб вони приєдналися
            </p>
          </div>
        </div>

        {/* Список гравців */}
        <div className="movie-card p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users className="text-purple-400" size={24} />
              Учасники
              <span className="text-slate-500 text-lg">({players.length})</span>
            </h2>
            <div className="text-sm">
              <span className="text-slate-400">Готові: </span>
              <span className="text-purple-400 font-semibold">
                {readyCount}/{players.length}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between bg-slate-900/50 p-4 rounded-xl border border-purple-500/10 hover:border-purple-500/30 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center font-bold text-white text-lg glow-effect">
                    {player.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-semibold">{player.name}</p>
                      {player.isHost && (
                        <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full text-xs">
                          <Crown size={12} />
                          <span>Господар</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  {player.isReady ? (
                    <div className="flex items-center gap-2 text-green-400">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold">Готовий</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-500">
                      <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                      <span className="text-sm">Очікує...</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Кнопки керування */}
        <div className="flex gap-4">
          <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl px-6 py-4 transition-all duration-300">
            Вийти з кімнати
          </button>
          <button
            disabled={!canStart}
            className="flex-1 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-xl px-6 py-4 transition-all duration-300 transform hover:scale-105 disabled:transform-none glow-effect-pink disabled:shadow-none flex items-center justify-center gap-2"
          >
            <Play size={20} className="fill-current" />
            {canStart ? "Почати гру" : "Очікування гравців..."}
          </button>
        </div>

        {!canStart && (
          <p className="text-center text-slate-500 text-sm mt-4">
            Всі учасники повинні бути готові, щоб почати
          </p>
        )}
      </div>
    </div>
  );
};
export default Room;
