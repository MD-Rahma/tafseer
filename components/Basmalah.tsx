interface BasmalahProps {
  text: string;
}

export default function Basmalah({ text }: BasmalahProps) {
  return (
    <div className="text-center pt-8 pb-12 mb-8 border-b-2 border-emerald-100/50 dark:border-emerald-900/30 transition-colors">
      <p className="text-4xl md:text-5xl text-[#064e3b] dark:text-[#b4914a] font-serif transition-colors">
        {text}
      </p>
    </div>
  );
}