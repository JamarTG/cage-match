import React from "react";


export interface Match {
    date: string;
    time: string;
    player1Username: string;
    player2Username: string;
}

const ViewScheduledMatches: React.FC<{ matches: Match[] }> = ({ matches }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-white">
            {matches.map((match, index) => (
                <div
                    key={index}
                    className="shadow-lg rounded-lg p-6 m-4 w-full max-w-md text-center"
                >
                    <div className="mb-4">
                        {/* <p className="text-lg font-medium">{match.player1.realName}</p> */}
                        <p className="text-sm text-gray-400">{match.player1Username}</p>
                    </div>
                    <p className="text-gray-400 font-bold mb-4">vs</p>
                    <div className="mb-4">
                        {/* <p className="text-lg font-medium">{match.player.realName}</p> */}
                        <p className="text-sm text-gray-400">{match.player2Username}</p>
                    </div>
                    <div className="text-gray-400">
                        <p className="text-lg font-semibold">
                            {new Date(match.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </p>
                        <p>{match.time}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ViewScheduledMatches;
