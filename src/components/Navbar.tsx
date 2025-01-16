interface NavbarProps {
  playerOneUsername: string;
  playerOneScore: number;
  playerTwoUsername: string;
  playerTwoScore: number;
}

const Navbar: React.FC<NavbarProps> = ({
  playerOneUsername,
  playerOneScore,
  playerTwoUsername,
  playerTwoScore,
}) => {
  return (
    <div className="p-5 mb-6 justify-center items-center w-full flex">
      <div className=" flex items-center gap-6 rounded-xl border-4 border-transparent bg-clip-padding">
        <div className="text-white text-3xl md:text-5xl font-semibold">
          {playerOneUsername}{" "}
          <span className="text-blue-400 text-4xl md:text-6xl">{playerOneScore}</span>
        </div>

        <div className="text-white text-4xl md:text-6xl font-semibold">vs</div>

        <div className="text-white text-3xl md:text-5xl font-semibold gap">
          <span className="text-blue-400 text-4xl md:text-6xl">{playerTwoScore}</span>{" "}
          {playerTwoUsername}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
