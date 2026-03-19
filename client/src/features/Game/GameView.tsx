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
  setWinnerMovie,
} from "../../store/slices/gameSlice";
import { updateRoom } from "../../store/slices/roomSlice";
import type { Movie, Room, RootState } from "../../types/types";
import { getOrCreatePlayerToken } from "../../utils/utils";

interface GameViewProps {
  roomId?: string;
}

const GameView = ({ roomId }: GameViewProps) => {
  const dispatch = useDispatch();
  const username = useSelector((state: RootState) => state.player.username);
  const room = useSelector((state: RootState) => state.room);
  const currentIndex = useSelector(
    (state: RootState) => state.game.currentIndex,
  );
  const winnerMovie = useSelector((state: RootState) => state.game.winnerMovie);
  const players = Object.values(room.players);
  const movies = room.movies;
  const activeMovie = movies[currentIndex] ?? movies[0];
  const movieId = activeMovie.id;
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
  const hasWinnerMovie = winnerMovie.id !== 0;
  const [dismissedWinnerId, setDismissedWinnerId] = useState<number | null>(
    null,
  );
  const isWinnerOverlayOpen =
    hasWinnerMovie && winnerMovie.id !== dismissedWinnerId;

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
    if (!roomId || !username) {
      return;
    }

    const handleRoomData = (incomingRoom: Room) => {
      dispatch(updateRoom(incomingRoom));
    };

    const handleMatchedFilm = (winnerMovie: Movie) => {
      if (winnerMovie) {
        dispatch(setWinnerMovie(winnerMovie));
      }
    };

    socket.on("room-updated", handleRoomData);
    socket.on("starting-game", handleRoomData);
    socket.emit("create-room", {
      roomId,
      username,
      playerToken: getOrCreatePlayerToken(),
    });

    socket.on("matched-film", handleMatchedFilm);

    return () => {
      socket.off("room-updated", handleRoomData);
      socket.off("starting-game", handleRoomData);
      socket.off("matched-film", handleMatchedFilm);
    };
  }, [dispatch, roomId, username]);

  useEffect(() => {
    if (!movies.length) {
      dispatch(resetGameState());
      return;
    }

    if (currentIndex >= movies.length) {
      dispatch(setCurrentIndex(movies.length - 1));
    }
  }, [currentIndex, dispatch, movies.length]);

  return (
    <div className="relative min-h-screen overflow-hidden px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
      {hasWinnerMovie && isWinnerOverlayOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-3 backdrop-blur-md sm:px-6">
          <div className="movie-card w-full max-w-4xl overflow-hidden p-0">
            <div className="relative h-64 w-full sm:h-80">
              {winnerMovie.backdrop_path || winnerMovie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w780${winnerMovie.backdrop_path || winnerMovie.poster_path}`}
                  alt={winnerMovie.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-linear-to-br from-pink-500/20 via-purple-500/20 to-slate-900" />
              )}
              <div className="absolute inset-0 bg-black/55" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pink-200">
                  Match Found
                </p>
                <h2 className="mt-2 text-3xl font-black text-white sm:text-5xl">
                  {winnerMovie.title}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">
                  {winnerMovie.overview ||
                    "Гравці обрали цей фільм одноголосно."}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-white/90 sm:text-sm">
                  <span className="rounded-full border border-white/30 bg-black/30 px-3 py-1">
                    ⭐ {winnerMovie.vote_average.toFixed(1)}
                  </span>
                  <span className="rounded-full border border-white/30 bg-black/30 px-3 py-1">
                    {winnerMovie.release_date?.slice(0, 4) || "Рік невідомий"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setDismissedWinnerId(winnerMovie.id)}
                  className="mt-6 w-full rounded-2xl bg-pink-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-pink-400 sm:w-fit"
                >
                  Зрозуміло
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-pink-500/15 blur-3xl" />
        <div className="absolute top-24 right-0 h-80 w-80 rounded-full bg-purple-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-4 sm:gap-6">
        <GameHeader
          roomId={roomId}
          cardProgress={cardProgress}
          matchState={matchState}
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <GameMoviePanel
            {...moviePanelData}
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
      </div>
    </div>
  );
};

const mapMovieToPanelData = (movie: Movie | undefined) => {
  if (!movie) {
    return {
      genre: "No data",
      rating: "-",
      eyebrow: "Featured movie",
      title: "Очікуємо фільми з сервера",
      meta: "Натисніть 'Почати гру' у кімнаті",
      imageUrl: null,
      description:
        "Після запуску гри бекенд пришле об'єкт кімнати з масивом movies.",
      tags: ["Waiting for room data"],
      stats: [
        { label: "Рейтинг", value: "-" },
        { label: "Мова", value: "-" },
        { label: "Голосів", value: "-" },
      ],
    };
  }

  const year = movie.release_date?.slice(0, 4) || "-";
  const language = movie.original_language?.toUpperCase() || "-";
  const imagePath = movie.backdrop_path || movie.poster_path || "";
  const imageUrl = imagePath
    ? `https://image.tmdb.org/t/p/w780${imagePath}`
    : null;

  const tags = [
    movie.adult ? "18+" : "Family-friendly",
    movie.video ? "Has trailer" : "Movie",
    `Popularity ${Math.round(movie.popularity)}`,
  ];

  return {
    genre:
      movie.genre_ids.length > 0
        ? `Genres: ${movie.genre_ids.join(", ")}`
        : "Unknown genre",
    rating: movie.vote_average ? movie.vote_average.toFixed(1) : "-",
    eyebrow: "Featured movie",
    title: movie.title || movie.original_title || "Untitled",
    meta: `${year} • ${language} • votes ${movie.vote_count}`,
    imageUrl,
    description: movie.overview || "Опис відсутній",
    tags,
    stats: [
      {
        label: "Рейтинг",
        value: movie.vote_average ? movie.vote_average.toFixed(1) : "-",
      },
      { label: "Мова", value: language },
      { label: "Голосів", value: String(movie.vote_count) },
    ],
  };
};

export default GameView;
