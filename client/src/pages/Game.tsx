import { useParams } from "react-router";
import GameView from "../features/Game/GameView";

const Game = () => {
  const { roomId } = useParams();

  return <GameView roomId={roomId} />;
};

export default Game;
