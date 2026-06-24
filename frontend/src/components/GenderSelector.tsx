interface GenderSelectorProps {
  onSelect: (gender: "Male" | "Female") => void;
}

const GenderSelector = ({ onSelect }: GenderSelectorProps) => {
  return (
    <div className="p-8 md:p-12 animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Let's get started</h2>
        <p className="text-slate-500 mt-2">To begin your InsuliQ risk check, please select your biological sex.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg mx-auto">
        <button
          onClick={() => onSelect("Female")}
          className="group relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 hover:bg-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-medical-500/30 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          <div className="relative z-10 flex flex-col items-center gap-5">
            <div className="rounded-full w-36 h-36 overflow-hidden border-4 border-white/30 group-hover:border-white/60 shadow-xl group-hover:scale-105 transition-all duration-500 bg-white/20">
              <img 
                src="/female_avatar.png" 
                alt="Female Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-2xl font-bold text-slate-800 group-hover:text-medical-800 transition-colors tracking-tight">Female</span>
          </div>
        </button>

        <button
          onClick={() => onSelect("Male")}
          className="group relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 hover:bg-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-medical-500/30 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          <div className="relative z-10 flex flex-col items-center gap-5">
            <div className="rounded-full w-36 h-36 overflow-hidden border-4 border-white/30 group-hover:border-white/60 shadow-xl group-hover:scale-105 transition-all duration-500 bg-white/20">
              <img 
                src="/male_avatar.png" 
                alt="Male Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-2xl font-bold text-slate-800 group-hover:text-medical-800 transition-colors tracking-tight">Male</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default GenderSelector;
