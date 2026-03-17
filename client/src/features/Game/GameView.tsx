import GameHeader from "./GameHeader";
import GameMatchPanel from "./GameMatchPanel";
import GameMoviePanel from "./GameMoviePanel";
import GamePlayersPanel from "./GamePlayersPanel";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "../../services/socket";
import {
  addPlayerLike,
  nextMovie,
  resetGameState,
  setCurrentIndex,
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
  const players = Object.values(room.players);
  const movies = room.movies;
  const activeMovie = movies[currentIndex] ?? movies[0];
  const upcomingMovie = movies[currentIndex + 1];

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

    dispatch(addPlayerLike(activeMovie.id));
    dispatch(nextMovie({ totalMovies: movies.length }));
  };

  useEffect(() => {
    if (!roomId || !username) {
      return;
    }

    const handleRoomData = (incomingRoom: Room) => {
      dispatch(updateRoom(incomingRoom));
    };

    socket.on("room-updated", handleRoomData);
    socket.on("starting-game", handleRoomData);
    socket.emit("create-room", {
      roomId,
      username,
      playerToken: getOrCreatePlayerToken(),
    });

    return () => {
      socket.off("room-updated", handleRoomData);
      socket.off("starting-game", handleRoomData);
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
