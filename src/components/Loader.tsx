const Loader: React.FC = () => {
  return (
    <div className="absolute inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="animate-spin rounded-full border-t-4 border-indigo-600 w-16 h-16"></div>
    </div>
  );
};

export default Loader;

