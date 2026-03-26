import { useMemo, useRef, useState } from "react";
import { Check, Heart, Star, X } from "lucide-react";

interface GameMoviePanelProps {
  genre: string;
  rating: string;
  eyebrow: string;
  title: string;
  meta: string;
  imageUrl: string | null;
  description: string;
  tags: string[];
  stats: Array<{ label: string; value: string }>;
  canSwipe: boolean;
  hasNextCard: boolean;
  nextTitle: string;
  nextMeta: string;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

const GameMoviePanel = ({
  genre,
  rating,
  eyebrow,
  title,
  meta,
  imageUrl,
  description,
  tags,
  stats,
  canSwipe,
  hasNextCard,
  nextTitle,
  nextMeta,
  onSwipeLeft,
  onSwipeRight,
}: GameMoviePanelProps) => {
  const supportsPointerEvents =
    typeof window !== "undefined" && "PointerEvent" in window;
  const SWIPE_THRESHOLD = 110;
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const pointerStartXRef = useRef(0);
  const activePointerIdRef = useRef<number | null>(null);

  const rotation = useMemo(
    () => Math.max(-12, Math.min(12, dragX / 18)),
    [dragX],
  );
  const dragStrength = Math.min(Math.abs(dragX) / SWIPE_THRESHOLD, 1);
  const previewScale = hasNextCard ? 0.95 + dragStrength * 0.04 : 0.93;
  const previewTranslateY = hasNextCard
    ? Math.max(4, 10 - dragStrength * 6)
    : 10;
  const previewOpacity = hasNextCard ? 0.45 + dragStrength * 0.25 : 0.25;

  const startDrag = (clientX: number, pointerId: number) => {
    if (!canSwipe || isAnimatingOut) {
      return;
    }

    activePointerIdRef.current = pointerId;
    pointerStartXRef.current = clientX - dragX;
    setIsDragging(true);
  };

  const moveDrag = (clientX: number) => {
    if (!canSwipe || !isDragging || isAnimatingOut) {
      return;
    }

    setDragX(clientX - pointerStartXRef.current);
  };

  const endDrag = () => {
    if (!isDragging) {
      return;
    }

    setIsDragging(false);
    activePointerIdRef.current = null;

    if (dragX > SWIPE_THRESHOLD) {
      setIsAnimatingOut(true);
      setDragX(420);
      setTimeout(() => {
        onSwipeRight();
        setDragX(0);
        setIsAnimatingOut(false);
      }, 180);
      return;
    }

    if (dragX < -SWIPE_THRESHOLD) {
      setIsAnimatingOut(true);
      setDragX(-420);
      setTimeout(() => {
        onSwipeLeft();
        setDragX(0);
        setIsAnimatingOut(false);
      }, 180);
      return;
    }

    setDragX(0);
  };

  const likeOpacity = Math.max(0, Math.min(1, dragX / SWIPE_THRESHOLD));
  const nopeOpacity = Math.max(0, Math.min(1, -dragX / SWIPE_THRESHOLD));
  const rightIndicatorOpacity = dragX > 10 ? Math.max(0.22, likeOpacity) : 0;
  const leftIndicatorOpacity = dragX < -10 ? Math.max(0.22, nopeOpacity) : 0;
  const rightIndicatorScale = 0.9 + dragStrength * 0.25;
  const leftIndicatorScale = 0.9 + dragStrength * 0.25;

  const startMouseDrag = (clientX: number) => {
    if (supportsPointerEvents) {
      return;
    }

    startDrag(clientX, -1);
  };

  const moveMouseDrag = (clientX: number) => {
    if (supportsPointerEvents || activePointerIdRef.current !== -1) {
      return;
    }

    moveDrag(clientX);
  };

  const endMouseDrag = () => {
    if (supportsPointerEvents || activePointerIdRef.current !== -1) {
      return;
    }

    endDrag();
  };

  const startTouchDrag = (clientX: number) => {
    if (supportsPointerEvents) {
      return;
    }

    startDrag(clientX, -2);
  };

  const moveTouchDrag = (clientX: number) => {
    if (supportsPointerEvents || activePointerIdRef.current !== -2) {
      return;
    }

    moveDrag(clientX);
  };

  const endTouchDrag = () => {
    if (supportsPointerEvents || activePointerIdRef.current !== -2) {
      return;
    }

    endDrag();
  };

  return (
    <section className="movie-card overflow-hidden">
      <div className="grid lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="relative min-h-72 sm:min-h-105 lg:min-h-full">
          <div className="pointer-events-none absolute inset-0 z-50">
            <div
              className="absolute top-4 left-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-rose-300 bg-rose-500/45 text-white shadow-lg shadow-rose-500/40 sm:h-14 sm:w-14"
              style={{
                opacity: leftIndicatorOpacity,
                transform: `scale(${leftIndicatorScale})`,
              }}
            >
              <X className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <div
              className="absolute top-4 right-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-emerald-300 bg-emerald-500/45 text-white shadow-lg shadow-emerald-500/40 sm:h-14 sm:w-14"
              style={{
                opacity: rightIndicatorOpacity,
                transform: `scale(${rightIndicatorScale})`,
              }}
            >
              <Check className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute inset-2 rounded-2xl border border-white/12 bg-slate-900/35 p-3 text-white shadow-xl backdrop-blur-sm sm:inset-3 sm:rounded-[28px] sm:p-4"
              style={{
                transform: `translateY(${previewTranslateY}px) scale(${previewScale})`,
                opacity: previewOpacity,
                transition: "transform 180ms ease, opacity 180ms ease",
              }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-300/80 sm:text-xs">
                Next up
              </p>
              <h3 className="mt-1 line-clamp-1 text-sm font-bold leading-tight sm:mt-2 sm:line-clamp-2 sm:text-xl">
                {hasNextCard ? nextTitle : "Кінець підбірки"}
              </h3>
              <p className="mt-1.5 hidden text-[11px] text-slate-300/90 sm:block sm:text-sm">
                {hasNextCard ? nextMeta : "Дочекайся нової сесії з фільмами"}
              </p>
            </div>
          </div>

          <div
            className="relative z-10 min-h-72 bg-linear-to-br from-fuchsia-600 via-rose-500 to-amber-400 p-4 sm:min-h-105 sm:p-6 lg:min-h-full"
            style={{
              transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
              transition: isDragging
                ? "none"
                : "transform 180ms cubic-bezier(0.22, 1, 0.36, 1)",
              touchAction: "pan-y",
              cursor: canSwipe ? (isDragging ? "grabbing" : "grab") : "default",
            }}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              startDrag(event.clientX, event.pointerId);
            }}
            onPointerMove={(event) => {
              if (activePointerIdRef.current !== event.pointerId) {
                return;
              }

              moveDrag(event.clientX);
            }}
            onPointerUp={(event) => {
              if (activePointerIdRef.current !== event.pointerId) {
                return;
              }

              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId);
              }

              endDrag();
            }}
            onPointerCancel={() => {
              endDrag();
            }}
            onMouseDown={(event) => {
              startMouseDrag(event.clientX);
            }}
            onMouseMove={(event) => {
              moveMouseDrag(event.clientX);
            }}
            onMouseUp={() => {
              endMouseDrag();
            }}
            onMouseLeave={() => {
              endMouseDrag();
            }}
            onTouchStart={(event) => {
              const firstTouch = event.touches[0];

              if (!firstTouch) {
                return;
              }

              startTouchDrag(firstTouch.clientX);
            }}
            onTouchMove={(event) => {
              const firstTouch = event.touches[0];

              if (!firstTouch) {
                return;
              }

              moveTouchDrag(firstTouch.clientX);
            }}
            onTouchEnd={() => {
              endTouchDrag();
            }}
            onTouchCancel={() => {
              endTouchDrag();
            }}
          >
            {imageUrl && (
              <img
                src={imageUrl}
                alt={title}
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false}
              />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-slate-900/35 to-slate-900/10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_45%)]" />
            <div className="relative flex h-full flex-col justify-between rounded-2xl border border-white/25 bg-black/5 p-4 sm:rounded-[28px] sm:p-5">
              <div className="flex items-center justify-between text-white/90">
                <span className="rounded-full border border-white/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] sm:px-3 sm:text-xs sm:tracking-[0.25em]">
                  {genre}
                </span>
                <span className="flex items-center gap-1 rounded-full bg-black/20 px-2.5 py-1 text-xs font-semibold sm:px-3 sm:text-sm">
                  <Star className="h-3.5 w-3.5 fill-current sm:h-4 sm:w-4" />
                  {rating}
                </span>
              </div>

              <div className="rounded-2xl border border-white/20 bg-black/40 p-4 text-white shadow-2xl sm:rounded-3xl sm:p-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/70 sm:text-xs sm:tracking-[0.4em]">
                  {eyebrow}
                </p>
                <h2 className="mt-2 text-2xl font-black leading-tight sm:mt-3 sm:text-4xl overflow-hidden text-ellipsis wrap-break-word">
                  {title}
                </h2>
                <p className="mt-2 text-xs text-white/80 sm:mt-3 sm:text-sm">
                  {meta}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6 lg:p-8">
          <div className="hidden flex-wrap items-center gap-2 sm:flex">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 sm:px-3 sm:text-xs"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              Synopsis
            </p>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-200 sm:mt-3 sm:text-lg sm:leading-7">
              {description}
            </p>
          </div>

          <div className="hidden gap-2 sm:grid sm:grid-cols-3 sm:gap-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-purple-500/15 bg-slate-950/40 p-3 sm:rounded-2xl sm:p-4"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-1.5 text-base font-bold text-white sm:mt-2 sm:text-lg">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="sticky bottom-0 z-20 -mx-4 mt-1 border-t border-white/10 bg-slate-950/85 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] backdrop-blur sm:static sm:mx-0 sm:mt-0 sm:border-0 sm:bg-transparent sm:px-0 sm:pt-0 sm:pb-0 sm:backdrop-blur-none">
            <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
              <button
                onClick={onSwipeLeft}
                disabled={!canSwipe}
                className="group flex items-center justify-center gap-2.5 rounded-xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm font-bold text-rose-200 transition-all hover:scale-[1.02] hover:bg-rose-500/20 active:scale-95 active:bg-rose-500/25 disabled:cursor-not-allowed disabled:opacity-50 sm:gap-3 sm:rounded-[22px] sm:px-5 sm:py-4 sm:text-lg"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg shadow-rose-500/30 sm:h-11 sm:w-11">
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
                Пропустити
              </button>

              <button
                onClick={onSwipeRight}
                disabled={!canSwipe}
                className="group flex items-center justify-center gap-2.5 rounded-xl bg-linear-to-r from-fuchsia-500 via-pink-500 to-rose-500 px-4 py-3 text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-95 active:brightness-110 glow-effect-pink disabled:cursor-not-allowed disabled:opacity-50 sm:gap-3 sm:rounded-[22px] sm:px-5 sm:py-4 sm:text-lg"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm sm:h-11 sm:w-11">
                  <Heart className="h-4 w-4 fill-current sm:h-5 sm:w-5" />
                </span>
                Обираю це
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GameMoviePanel;
