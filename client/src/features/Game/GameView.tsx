import GameHeader from "./GameHeader";
import GameMatchPanel from "./GameMatchPanel";
import GameMoviePanel from "./GameMoviePanel";
import GamePlayersPanel from "./GamePlayersPanel";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "../../services/socket";
import {
  nextMovie,
  resetGameState,
  setCurrentIndex,
} from "../../store/slices/gameSlice";
import { clearMoviesOnly } from "../../store/slices/roomSlice";
import type { RootState } from "../../types/types";
import { mapMovieToPanelData } from "../../utils/utils";
import { useNavigate } from "react-router";
import WinnerMovie from "./WinnerMovie";
import { useGameSockets } from "../../hooks/useGameSockets";
import { setIsReady } from "../../store/slices/playerSlice";
import Spinner from "../../ui/Spinner";

interface GameViewProps {
  roomId?: string;
}

const GameView = ({ roomId }: GameViewProps) => {
  const navigate = useNavigate();
  const [mobilePanel, setMobilePanel] = useState<"players" | "match">(
    "players",
  );

  const dispatch = useDispatch();
  const username = useSelector((state: RootState) => state.player.username);
  const room = useSelector((state: RootState) => state.room);
  const isLoadingMovies = useSelector(
    (state: RootState) => state.room.isLoadingMovies,
  );
  const currentIndex = useSelector(
    (state: RootState) => state.game.currentIndex,
  );
  const winnerMovie = useSelector((state: RootState) => state.game.winnerMovie);
  const players = Object.values(room.players);
  const movies = room.movies;
  const activeMovie = movies[currentIndex] ?? movies[0];
  const movieId = activeMovie?.id;
  const upcomingMovie = movies[currentIndex + 1];

  const playersObject = useSelector((state: RootState) => state.room.players);
  const currentPlayer = socket.id ? playersObject[socket.id] : undefined;
  const playerId: string | undefined = currentPlayer?.id;

  const cardProgress = movies.length
    ? `${Math.min(currentIndex + 1, movies.length)} / ${movies.length}`
    : "0 / 0";

  const matchState = movies.length
    ? `${movies.length} фільмів у раунді`
    : "Очікуємо старт гри";

  const onlineCount = `${players.length} online`;

  const moviePanelData = mapMovieToPanelData(activeMovie);
  const nextMoviePanelData = mapMovieToPanelData(upcomingMovie);

  const playersPanelData = players.map((player) => ({
    id: player.id,
    name: player.username,
    state: player.isReady ? "Готовий" : "Очікує",
    isHost: player.isHost,
  }));

  const matchTitle = activeMovie ? "Поточний кандидат" : "Матч ще не знайдено";
  const matchDescription = activeMovie
    ? `Зараз переглядаєте: ${activeMovie.title}`
    : "Після натискання 'Почати гру' тут з'явиться активний фільм із сервера.";
  const matchStatus = activeMovie
    ? `Картка ${cardProgress}`
    : "Очікуємо завантаження фільмів";
  const nextStep = activeMovie
    ? "Зробіть лайк або пропуск"
    : "Поверніться в кімнату і запустіть гру";

  //sockets connect hook
  useGameSockets(roomId, username);

  const handleWinnerClose = async () => {
    if (!roomId) {
      return;
    }

    socket.emit("reset-round", { roomId });
    dispatch(setIsReady(false));
    dispatch(resetGameState());
    dispatch(clearMoviesOnly());
    navigate(`/rooms/${roomId}`);
  };

  const handleSwipeLeft = () => {
    if (!movies.length) {
      return;
    }

    dispatch(nextMovie({ totalMovies: movies.length }));
  };

  const handleSwipeRight = () => {
    if (!activeMovie || !movies.length) {
      return;
    }

    dispatch(nextMovie({ totalMovies: movies.length }));

    if (!roomId || !movieId || !playerId) return;

    socket.emit("like", { roomId, movieId, playerId });
  };

  useEffect(() => {
    if (!movies.length && !isLoadingMovies) {
      dispatch(resetGameState());
      return;
    }

    if (currentIndex >= movies.length) {
      dispatch(setCurrentIndex(movies.length - 1));
    }
  }, [currentIndex, dispatch, movies.length, isLoadingMovies]);

  return (
    <div className="relative min-h-screen overflow-hidden px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
      <WinnerMovie
        hasWinnerMovie={winnerMovie.id !== 0}
        winnerMovie={winnerMovie}
        onClose={handleWinnerClose}
      />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-pink-500/15 blur-3xl" />
        <div className="absolute top-24 right-0 h-80 w-80 rounded-full bg-purple-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      {isLoadingMovies && !movies.length && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm z-50">
          <div className="text-center">
            <Spinner className="h-12 w-12 text-purple-500 mx-auto animate-spin" />
            <p className="text-white mt-4 text-lg">Завантаження фільмів...</p>
          </div>
        </div>
      )}

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-4 sm:gap-6">
        <GameHeader
          roomId={roomId}
          cardProgress={cardProgress}
          matchState={matchState}
          onBackClick={() => {
            if (roomId) {
              // Notify server that user is leaving the game
              socket.emit("leave-game", { roomId });
            }
            dispatch(clearMoviesOnly());
            dispatch(resetGameState());
            navigate(`/rooms/${roomId}`);
          }}
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <GameMoviePanel
            {...moviePanelData}
            movie={activeMovie}
            canSwipe={Boolean(activeMovie)}
            hasNextCard={Boolean(upcomingMovie)}
            nextTitle={nextMoviePanelData.title}
            nextMeta={nextMoviePanelData.meta}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
          />

          <aside className="hidden xl:flex xl:flex-col xl:gap-6">
            <GamePlayersPanel
              players={playersPanelData}
              onlineCount={onlineCount}
            />
            <GameMatchPanel
              winnerMovie={winnerMovie}
              title={matchTitle}
              description={matchDescription}
              status={matchStatus}
              nextStep={nextStep}
            />
          </aside>
        </div>

        <section className="xl:hidden">
          <div className="mb-3 grid grid-cols-2 gap-2 rounded-2xl border border-purple-500/15 bg-slate-950/35 p-1.5">
            <button
              type="button"
              onClick={() => setMobilePanel("players")}
              className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                mobilePanel === "players"
                  ? "bg-purple-500/30 text-white"
                  : "text-slate-300"
              }`}
            >
              Гравці
            </button>
            <button
              type="button"
              onClick={() => setMobilePanel("match")}
              className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                mobilePanel === "match"
                  ? "bg-pink-500/30 text-white"
                  : "text-slate-300"
              }`}
            >
              Match
            </button>
          </div>

          {mobilePanel === "players" ? (
            <GamePlayersPanel
              players={playersPanelData}
              onlineCount={onlineCount}
            />
          ) : (
            <GameMatchPanel
              winnerMovie={winnerMovie}
              title={matchTitle}
              description={matchDescription}
              status={matchStatus}
              nextStep={nextStep}
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default GameView;
