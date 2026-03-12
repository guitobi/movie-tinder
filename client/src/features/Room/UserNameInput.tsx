import { X, User, Sparkles } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setRoomId } from "../../store/slices/roomSlice";

import { setUsername as setUsernameAction } from "../../store/slices/playerSlice";
import useRoomId from "../../hooks/useRoomId";

interface UserNameInputProps {
  onClose: () => void;
}

const UserNameInput: React.FC<UserNameInputProps> = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const { isLoading, createRoom } = useRoomId();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      console.log("Username:", username);
      const roomId = await createRoom();
      if (roomId) dispatch(setRoomId(roomId)); // pass roomId to state
      dispatch(setUsernameAction(username)); // pass username to state
      navigate(`/rooms/${roomId}`);
      onClose();
    }
  };

  return (
    <div className="inset-0 backdrop-blur-2xl bg-black/50 fixed flex justify-center items-center z-50 px-3 sm:px-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md movie-card p-5 sm:p-6 md:p-8 shadow-2xl glow-effect transform animate-in zoom-in-95 duration-300">
        <button
          onClick={() => onClose()}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full hover:bg-slate-700/50 transition-colors group"
          aria-label="Close"
        >
          <X className="text-slate-400 group-hover:text-white transition-colors w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="p-3 sm:p-4 bg-linear-to-br from-purple-600 to-pink-600 rounded-full glow-effect-pink animate-pulse-glow">
            <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
        </div>

        <div className="text-center mb-5 sm:mb-6 md:mb-8">
          <h2 className="text-white font-bold text-2xl sm:text-3xl mb-2 flex items-center justify-center gap-2">
            Вітаємо!
            <Sparkles className="text-yellow-400 w-5 h-5 sm:w-6 sm:h-6" />
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Введіть ваш нікнейм, щоб продовжити
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 sm:gap-5 md:gap-6"
        >
          <div className="relative">
            <label
              htmlFor="username"
              className="block text-slate-300 font-semibold mb-2 text-xs sm:text-sm"
            >
              Нікнейм
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900/50 border border-purple-500/20 text-white px-3 sm:px-4 py-2.5 sm:py-3 pl-10 sm:pl-11 rounded-xl focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder:text-slate-500 text-sm sm:text-base"
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

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => onClose()}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 transition-all duration-300 text-sm sm:text-base"
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={!username.trim()}
              className="flex-1 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 transition-all duration-300 transform hover:scale-105 disabled:transform-none glow-effect-pink disabled:shadow-none flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              Продовжити
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </form>

        <p className="text-slate-500 text-xs text-center mt-4 sm:mt-5 md:mt-6">
          Ваш нікнейм буде видно іншим учасникам кімнати
        </p>
      </div>
    </div>
  );
};
export default UserNameInput;
