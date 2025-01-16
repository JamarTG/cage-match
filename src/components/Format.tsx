import React from "react";

const Format: React.FC = () => {
  return (
    <div className="w-1/2 justify-start text-white">
      <div className="flex flex-col justify-start items-start">
        <div className="flex">
          <span className="icon mr-2 text-sm">&#xe008;</span>
          <p className="text-sm">3+2 Blitz</p>
        </div>

        <p className="text-sm">Quarter Finals</p>
      </div>
    </div>
  );
};

export default Format;
