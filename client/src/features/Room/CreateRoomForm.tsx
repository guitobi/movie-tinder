import { useState, type FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setUsername as setUsernameAction } from "../../store/slices/playerSlice";
import { setRoomId } from "../../store/slices/roomSlice";
import type { CreateRoomResponse } from "../../types/types";
import EntryFormLayout from "./EntryFormLayout";
import UserNameInput from "./UserNameInput";

const URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

interface CreateRoomFormProps {
  onClose?: () => void;
}

const CreateRoomForm = ({ onClose }: CreateRoomFormProps) => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setErrorMessage("Введіть нікнейм, щоб продовжити");
      return;
    }

    setErrorMessage("");
    dispatch(setUsernameAction(trimmedUsername));
    setIsLoading(true);

    try {
      const response = await fetch(`${URL}/api/rooms/create`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Не вдалося створити кімнату. Спробуйте ще раз.");
      }

      const data: CreateRoomResponse = await response.json();
      dispatch(setRoomId(data.roomId));
      navigate(`/rooms/${data.roomId}`);
      onClose?.();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Сталася неочікувана помилка");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EntryFormLayout
      title="Створення гри"
      subtitle="Введіть ваш нікнейм, щоб створити нову кімнату"
      footerText="Ваш нікнейм буде видно іншим учасникам кімнати"
      submitLabel="Створити"
      loadingLabel="Створення..."
      errorMessage={errorMessage}
      isLoading={isLoading}
      isSubmitDisabled={isLoading || !username.trim()}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <UserNameInput
        inputId="create-username"
        value={username}
        onChange={(value) => {
          setUsername(value);
          if (errorMessage) {
            setErrorMessage("");
          }
        }}
      />
    </EntryFormLayout>
  );
};

export default CreateRoomForm;
