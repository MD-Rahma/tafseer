export default function LoadingPulse() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="relative flex items-center justify-center w-24 h-24">
        <div className="absolute inset-0 border-4 border-[#b4914a] rounded-full opacity-20 animate-ping"></div>
        <svg className="w-12 h-12 text-[#064e3b] animate-pulse relative z-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      </div>
    </div>
  );
}