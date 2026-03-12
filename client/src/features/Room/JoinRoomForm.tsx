import { Hash } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setUsername as setUsernameAction } from "../../store/slices/playerSlice";
import { setRoomId } from "../../store/slices/roomSlice";
import EntryFormLayout from "./EntryFormLayout";
import UserNameInput from "./UserNameInput";

interface JoinRoomFormProps {
  onClose?: () => void;
}

const JoinRoomForm = ({ onClose }: JoinRoomFormProps) => {
  const [username, setUsername] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedUsername = username.trim();
    const trimmedRoomCode = roomCode.trim().toUpperCase();

    if (!trimmedUsername) {
      setErrorMessage("Введіть нікнейм, щоб продовжити");
      return;
    }

    if (!trimmedRoomCode) {
      setErrorMessage("Введіть код кімнати, щоб приєднатися");
      return;
    }

    setErrorMessage("");
    dispatch(setUsernameAction(trimmedUsername));
    dispatch(setRoomId(trimmedRoomCode));
    navigate(`/rooms/${trimmedRoomCode}`);
    onClose?.();
  };

  return (
    <EntryFormLayout
      title="Приєднання до гри"
      subtitle="Введіть нікнейм та код кімнати"
      footerText="Код кімнати потрібен, щоб підключитися до вже створеної гри"
      submitLabel="Залетіти"
      errorMessage={errorMessage}
      isLoading={false}
      isSubmitDisabled={!username.trim() || !roomCode.trim()}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <UserNameInput
        inputId="join-username"
        value={username}
        onChange={(value) => {
          setUsername(value);
          if (errorMessage) {
            setErrorMessage("");
          }
        }}
      />

      <div className="relative">
        <label
          htmlFor="join-room-code"
          className="mb-2 block text-xs font-semibold text-slate-300 sm:text-sm"
        >
          Код кімнати
        </label>
        <div className="relative">
          <Hash className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500 sm:h-5 sm:w-5" />
          <input
            type="text"
            id="join-room-code"
            value={roomCode}
            onChange={(event) => {
              setRoomCode(event.target.value.toUpperCase());
              if (errorMessage) {
                setErrorMessage("");
              }
            }}
            className="w-full rounded-xl border border-purple-500/20 bg-slate-900/50 px-3 py-2.5 pl-10 text-sm text-white uppercase tracking-[0.3em] transition-all placeholder:text-slate-500 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none sm:px-4 sm:py-3 sm:pl-11 sm:text-base"
            placeholder="ABCDE"
            maxLength={5}
          />
        </div>
      </div>
    </EntryFormLayout>
  );
};

export default JoinRoomForm;
