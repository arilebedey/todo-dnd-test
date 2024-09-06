export const NewTask = () => {
  return (
    <div className="flex justify-center text-white w-full">
      <input
        type="text"
        placeholder="Новая задача"
        className=" h-[40px] bg-theme-900 rounded-lg border border-theme-500 px-3 flex-grow"
      ></input>
      <button className="bg-theme-100 text-white h-[40px] w-[40px] rounded-xl text-3xl font-light ml-4">
        +
      </button>
    </div>
  );
};
