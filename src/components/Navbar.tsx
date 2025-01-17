import React from "react";

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
    <nav className="bg-gray-800 text-white flex justify-between items-center px-4 py-2 shadow-lg">
      {/* Logo (hidden on small screens) */}
      <div className="hidden md:flex items-center space-x-2">
        <img src="/piece.png" width={50} alt="Chess Logo" />
        <span className="text-xl font-bold">Chess Arena</span>
      </div>
      {/* Score Section */}
      <div className="flex items-center justify-between w-full md:w-auto space-x-4 md:space-x-12">
        {/* Player One */}
        <div className="text-center">
          <span className="block text-sm md:text-lg font-semibold">
            {playerOneUsername}
          </span>
          <span className="block text-lg md:text-2xl font-bold text-yellow-400">
            {playerOneScore}
          </span>
        </div>
        <span className="text-lg md:text-3xl font-bold text-gray-400">VS</span>
        {/* Player Two */}
        <div className="text-center">
          <span className="block text-sm md:text-lg font-semibold">
            {playerTwoUsername}
          </span>
          <span className="block text-lg md:text-2xl font-bold text-blue-400">
            {playerTwoScore}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
