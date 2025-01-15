import { useState } from 'react';

interface Player {
    realName: string;
    lichessAccount: string;
}

interface Match {
    player1: Player;
    player2: Player;
    date: string;
    time: string;
}

const checkLichessAccount = async (username: string): Promise<boolean> => {
    try {
        const response = await fetch(`https://lichess.org/api/user/${username}`);
        return response.ok;
    } catch (error) {
        console.error('Error checking Lichess account:', error);
        return false;
    }
};

const CreateMatch: React.FC = () => {
    const [player1, setPlayer1] = useState<Player>({ realName: '', lichessAccount: '' });
    const [player2, setPlayer2] = useState<Player>({ realName: '', lichessAccount: '' });
    const [date, setDate] = useState<string>('');
    const [time, setTime] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const hardcodedPassword = 'yourHardcodedPassword';
        if (password !== hardcodedPassword) {
            setError('Invalid password.');
            return;
        }

        const isPlayer1Valid = await checkLichessAccount(player1.lichessAccount);
        const isPlayer2Valid = await checkLichessAccount(player2.lichessAccount);

        if (!isPlayer1Valid || !isPlayer2Valid) {
            setError('One or both Lichess accounts are invalid.');
            return;
        }

        const match: Match = { player1, player2, date, time };
        console.log('Match scheduled:', match);
        // Add your scheduling logic here
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white shadow-md rounded">
            <h2 className="text-2xl font-bold mb-4">Schedule a Match</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
                <label className="block text-gray-700">Player 1:</label>
                <div className="flex space-x-4">
                    <input
                        type="text"
                        placeholder="Real Name"
                        value={player1.realName}
                        onChange={(e) => setPlayer1({ ...player1, realName: e.target.value })}
                        required
                        className="w-1/2 px-3 py-2 border rounded"
                    />
                    <input
                        type="text"
                        placeholder="Lichess Account"
                        value={player1.lichessAccount}
                        onChange={(e) => setPlayer1({ ...player1, lichessAccount: e.target.value })}
                        required
                        className="w-1/2 px-3 py-2 border rounded"
                    />
                </div>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Player 2:</label>
                <div className="flex space-x-4">
                    <input
                        type="text"
                        placeholder="Real Name"
                        value={player2.realName}
                        onChange={(e) => setPlayer2({ ...player2, realName: e.target.value })}
                        required
                        className="w-1/2 px-3 py-2 border rounded"
                    />
                    <input
                        type="text"
                        placeholder="Lichess Account"
                        value={player2.lichessAccount}
                        onChange={(e) => setPlayer2({ ...player2, lichessAccount: e.target.value })}
                        required
                        className="w-1/2 px-3 py-2 border rounded"
                    />
                </div>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Match Date:</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Match Time:</label>
                <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Password:</label>
                <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded"
                />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
                Schedule Match
            </button>
        </form>
    );
};

export default CreateMatch;
