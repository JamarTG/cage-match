interface NavbarProps {
  playerOneUsername: string;
}

const Navbar: React.FC<NavbarProps> = ({ playerOneUsername }) => {
  return (
    <div className="bg-gray-800 w-full p-3 mb-5 flex gap-5 justify-center items-center gap-2 ">
      <div className="flex gap-2">
        <svg width="1.5em" height="1.5em" fill="#9146FF" viewBox="0 0 16 16">
          <path d="M3.857 0 1 2.857v10.286h3.429V16l2.857-2.857H9.57L14.714 8V0zm9.714 7.429-2.285 2.285H9l-2 2v-2H4.429V1.143h9.142z" />
          <path d="M11.857 3.143h-1.143V6.57h1.143zm-3.143 0H7.571V6.57h1.143z" />
        </svg>
        <a
          href="https://www.twitch.tv/masterglaves"
          target="_blank"
          style={{ color: "#9146FF" }}
        >
          Watch Live on Twitch/masterglaves
        </a>
      </div>

      <div className="flex gap-2">
        <svg width="1.5em" height="1.5em" fill="white" viewBox="0 0 24 24">
          <path d="M10.457 6.161a.237.237 0 0 0-.296.165c-.8 2.785 2.819 5.579 5.214 7.428.653.504 1.216.939 1.591 1.292 1.745 1.642 2.564 2.851 2.733 3.178a.24.24 0 0 0 .275.122c.047-.013 4.726-1.3 3.934-4.574a.257.257 0 0 0-.023-.06L18.204 3.407 18.93.295a.24.24 0 0 0-.262-.293c-1.7.201-3.115.435-4.5 1.425-4.844-.323-8.718.9-11.213 3.539C.334 7.737-.246 11.515.085 14.128c.763 5.655 5.191 8.631 9.081 9.532.993.229 1.974.34 2.923.34 3.344 0 6.297-1.381 7.946-3.85a.24.24 0 0 0-.372-.3c-3.411 3.527-9.002 4.134-13.296 1.444-4.485-2.81-6.202-8.41-3.91-12.749C4.741 4.221 8.801 2.362 13.888 3.31c.056.01.115 0 .165-.029l.335-.197c.926-.546 1.961-1.157 2.873-1.279l-.694 1.993a.243.243 0 0 0 .02.202l6.082 10.192c-.193 2.028-1.706 2.506-2.226 2.611-.287-.645-.814-1.364-2.306-2.803-.422-.407-1.21-.941-2.124-1.56-2.364-1.601-5.937-4.02-5.391-5.984a.239.239 0 0 0-.165-.295z" />
        </svg>
        <a
          href={`https://lichess.org/@/${playerOneUsername}/tv`}
          target="_blank"
          style={{ color: "white" }}
        >
          Watch On Lichess
        </a>
      </div>
    </div>
  );
};

export default Navbar;
