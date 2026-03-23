import {
  Copy,
  Users,
  Play,
  Crown,
  Film,
  Link as LinkIcon,
  DoorOpen,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import type { Room as RoomData, RootState } from "../types/types";
import socket, { startGameHandler } from "../services/socket";
import {
  setGameModeKey,
  setNumberOfMovies,
  updateRoom,
} from "../store/slices/roomSlice";
import { setUsername as setUsernameAction } from "../store/slices/playerSlice";
import { clearSessionStorage, getOrCreatePlayerToken } from "../utils/utils";
import Modal from "../ui/Modal";
import ModePickerContent from "../features/Room/ModePickerContent";
import { GAME_MODES, getGameModeByKey } from "../features/Room/gameModes";

const Room = () => {
  const [copied, setCopied] = useState(false);
  const [modeValidationMessage, setModeValidationMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const roomId = useSelector((state: RootState) => state.room.id);
  const selectedMode = useSelector(
    (state: RootState) => state.room.gameModeKey,
  );
  const numberOfMovies = useSelector(
    (state: RootState) => state.room.numberOfMovies,
  );
  const username = useSelector((state: RootState) => state.player.username);
  const playersObject = useSelector((state: RootState) => state.room.players);
  const players = Object.values(playersObject);
  const currentPlayer = socket.id ? playersObject[socket.id] : undefined;
  const isCurrentPlayerReady = currentPlayer?.isReady ?? false;

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const readyCount = players.filter((p) => p.isReady).length;
  const canStart = readyCount === players.length;
  const selectedModeOption = getGameModeByKey(selectedMode);

  const handleLeaveRoom = () => {
    if (roomId) {
      socket.emit("leave-room", { roomId });
    }

    socket.off("room-updated");
    dispatch(updateRoom({ id: "", players: {}, movies: [] }));
    dispatch(setGameModeKey(null));
    dispatch(setNumberOfMovies(0));
    dispatch(setUsernameAction(""));
    clearSessionStorage();
    navigate("/");
  };

  const handleToggleReady = () => {
    if (!roomId) {
      return;
    }

    if (!selectedMode) {
      setModeValidationMessage(
        "Оберіть режим гри перед підтвердженням готовності",
      );
      return;
    }

    socket.emit("toggle-ready", { roomId, isReady: !isCurrentPlayerReady });
  };

  const handleStartGame = () => {
    if (!selectedMode) {
      setModeValidationMessage("Оберіть режим гри перед стартом");
      return;
    }

    if (!numberOfMovies) {
      setModeValidationMessage("Оберіть кількість фільмів перед стартом");
      return;
    }

    startGameHandler(roomId, selectedMode, numberOfMovies);
  };

  useEffect(() => {
    if (!roomId || !username) {
      return;
    }

    const handleRoomUpdated = (room: RoomData) => {
      dispatch(updateRoom(room));
    };

    const handleStartingGame = (room: RoomData) => {
      dispatch(updateRoom(room));
      navigate(`/rooms/${room.id}/game`);
    };

    socket.on("room-updated", handleRoomUpdated);
    socket.on("starting-game", handleStartingGame);
    const playerToken = getOrCreatePlayerToken();
    socket.emit("create-room", {
      roomId,
      username,
      playerToken,
    });

    return () => {
      socket.off("room-updated", handleRoomUpdated);
      socket.off("starting-game", handleStartingGame);
    };
  }, [roomId, username, dispatch, navigate]);

  return (
    <Modal>
      <div className="min-h-screen flex flex-col items-center justify-start sm:justify-center p-3 sm:p-4 relative overflow-hidden">
        <button
          onClick={handleLeaveRoom}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 p-2.5 sm:p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all duration-300 transform hover:scale-105"
          aria-label="Вийти з кімнати"
          title="Вийти з кімнати"
        >
          <DoorOpen className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="absolute top-5 sm:top-10 right-4 sm:right-10 text-purple-500/10 animate-float">
          <Film className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24" />
        </div>

        <div className="relative z-10 w-full max-w-3xl pt-12 sm:pt-0">
          <div className="movie-card p-3 sm:p-6 md:p-8 mb-3 sm:mb-6 text-center">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-4">
              <Users className="text-purple-400 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400">
                Кімната
              </h1>
            </div>

            <div className="flex flex-row items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-4">
              <div className="bg-slate-900/50 px-3 sm:px-6 py-2 sm:py-3 rounded-xl border border-purple-500/30">
                <p className="text-slate-400 text-xs sm:text-sm">Код кімнати</p>
                <p className="text-xl sm:text-3xl font-mono font-bold text-white tracking-wider">
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
              <p className="text-[11px] sm:text-sm">
                Поділіться цим кодом з друзями, щоб вони приєдналися
              </p>
            </div>
          </div>

          {/* Вибір режиму гри */}
          <div className="movie-card p-3 sm:p-5 mb-3 sm:mb-6">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2">
                <Film className="text-purple-400 w-5 h-5 sm:w-6 sm:h-6" />
                Режим гри
              </h2>
              <Modal.Open opens="mode-picker">
                <button
                  className="shrink-0 rounded-xl border border-purple-500/30 bg-slate-900/60 px-3 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-slate-800/70 transition-colors"
                  title="Відкрити вибір режиму"
                >
                  {selectedModeOption?.title ?? "Обрати"}
                </button>
              </Modal.Open>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              Профіль підбору:{" "}
              {selectedModeOption?.movieFeedHint ?? "не обрано"}
            </p>
            {modeValidationMessage && (
              <p className="mt-2 text-xs text-rose-300">
                {modeValidationMessage}
              </p>
            )}
          </div>

          {/* Список гравців */}
          <div className="movie-card p-3 sm:p-6 md:p-8 mb-3 sm:mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-6 gap-2">
              <h2 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2">
                <Users className="text-purple-400 w-5 h-5 sm:w-6 sm:h-6" />
                Учасники
                <span className="text-slate-500 text-sm sm:text-lg">
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

            <div className="space-y-2 max-h-[34vh] sm:max-h-none overflow-y-auto pr-1">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between bg-slate-900/50 p-3 sm:p-4 rounded-xl border border-purple-500/10 hover:border-purple-500/30 transition-all group"
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center font-bold text-white text-sm sm:text-lg glow-effect shrink-0">
                      {player.username[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white font-semibold text-sm sm:text-base truncate max-w-32 sm:max-w-none">
                          {player.username}
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
          <div className="flex flex-col gap-3 sm:gap-5">
            <button
              onClick={handleToggleReady}
              className={`w-full font-semibold rounded-xl px-4 sm:px-6 py-2.5 sm:py-4 transition-all duration-300 text-sm sm:text-base ${
                isCurrentPlayerReady
                  ? "bg-green-600 hover:bg-green-500 text-white"
                  : "bg-slate-800 hover:bg-slate-700 text-white"
              }`}
            >
              {isCurrentPlayerReady ? "Я не готовий" : "Готовий!"}
            </button>
            <button
              onClick={handleStartGame}
              disabled={!canStart && currentPlayer?.isHost}
              className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-xl px-4 sm:px-6 py-2.5 sm:py-4 transition-all duration-300 transform hover:scale-105 disabled:transform-none glow-effect-pink disabled:shadow-none flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Play /> Почати гру
            </button>
          </div>

          {!canStart && (
            <p className="text-center text-slate-500 text-xs sm:text-sm mt-2 sm:mt-4 px-2 sm:px-4">
              Всі учасники повинні бути готові, щоб почати
            </p>
          )}
        </div>
      </div>

      <Modal.Window name="mode-picker">
        <ModePickerContent
          gameModes={GAME_MODES}
          selectedMode={selectedMode}
          selectedMoviesCount={numberOfMovies}
          onSelectMode={(mode) => {
            dispatch(setGameModeKey(mode));
            if (modeValidationMessage) {
              setModeValidationMessage("");
            }
          }}
          onSelectMoviesCount={(count) => {
            dispatch(setNumberOfMovies(count));
          }}
        />
      </Modal.Window>
    </Modal>
  );
};
export default Room;
