export const NewTask = () => {
  return (
    <div className="flex flex-row justify-center items-center w-[400px] mx-auto mt-24 text-white">
      <input
        type="text"
        className=" h-[40px] bg-theme-900 rounded-md border-2 border-theme-500 px-2"
      ></input>
      <button className="bg-theme-100 text-white h-[40px] w-[40px] rounded-md text-3xl font-light ml-4">
        +
      </button>
    </div>
  );
};
