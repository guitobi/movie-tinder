import { Popcorn } from "lucide-react";
import { useState } from "react";
import UserNameInput from "../features/Room/UserNameInput";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="bg-slate-800 h-screen flex flex-col justify-center items-center gap-6">
      <h2
        className="flex flex-row items-center text-stone-300 font-bold text-4xl whitespace-nowrap gap-2
"
      >
        MovieMatch
        <span className="flex items-center">
          <Popcorn size={37} />!
        </span>
      </h2>
      <button className="bg-pink-800 text-stone-300 font-semibold rounded-xl px-6 py-2 text-xl shadow-[0px_0px_100px_0px_rgba(195,34,128,0.25)]">
        Create Room
      </button>
      {isModalOpen && <UserNameInput />}
    </div>
  );
};
export default Home;
