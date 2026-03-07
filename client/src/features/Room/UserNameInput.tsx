import { X } from "lucide-react";

interface UserNameInputProps {
  onClose: () => void;
}

const UserNameInput: React.FC<UserNameInputProps> = ({ onClose }) => {
  return (
    <div className="inset-0 backdrop-blur-2xl fixed flex justify-center items-center">
      <div
        className="flex flex-col justify-center items-center absolute w-[75%] h-[65%] bg-slate-700 rounded-md
      "
      >
        <div onClick={() => onClose()} className="absolute top-0 right-0 p-2">
          <X color="white" />
        </div>
        <label
          htmlFor="username"
          className="text-stone-300 font-semibold text-2xl mb-10"
        >
          Enter your nickname
        </label>
        <form action="" className="flex flex-col justify-between items-center">
          <input
            type="text"
            id="username"
            className="bg-slate-800 px-2 py-1 rounded-md m-5 placeholder-stone-300"
            placeholder="Your nickname..."
          />
          <button className="bg-pink-800 text-stone-300 font-semibold rounded-xl px-6 py-2 text-xl shadow-[0px_0px_25px_0px_rgba(195,34,128,0.25)]">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};
export default UserNameInput;
