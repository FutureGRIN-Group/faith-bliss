export default function ChatContext({ input }: { input: string }) {
  return (
    <div className="max-h-[75vh]  overflow-y-auto flex flex-col gap-7 relative rounded-md mb-24 py-10 pb-5 px-5">
      <div className="bg-white/10 px-5 py-4  self-start rounded-3xl  rounded-tl-none max-w-[80%]">
        <p className="leading-normal">{input}</p>
      </div>
      <div className="bg-accent-400  px-5 py-4 self-end  rounded-3xl  rounded-tr-none max-w-[80%]">
        <p className="leading-normal">{input}</p>
      </div>
      <div className="bg-accent-400  px-5 py-4 self-end  rounded-3xl  rounded-tr-none max-w-[80%]">
        <p className="leading-normal">{input}</p>
      </div>
    </div>
  );
}
