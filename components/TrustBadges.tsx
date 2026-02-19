export function TrustBadges() {
  return (
    <section className="bg-gray-950 py-10 md:py-16 border-t border-gray-800/50">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">

          {/* Security Badge */}
          <div className="flex flex-col items-center text-center group">
            <div className="mb-4 p-4 rounded-xl 
                        bg-gradient-to-br from-indigo-950/70 to-purple-950/40 
                        border border-indigo-800/40 
                        shadow-md shadow-indigo-950/20 
                        transition-all duration-300">
              <svg className="w-10 h-10 md:w-14 md:h-14 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
              Secure
            </h3>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-xs">
              End-to-end encryption and zero-knowledge architecture — your contacts stay private.
            </p>
          </div>

          {/* Simplicity Badge */}
          <div className="flex flex-col items-center text-center group">
            <div className="mb-4 p-4 rounded-xl 
                        bg-gradient-to-br from-emerald-950/60 to-teal-950/40 
                        border border-emerald-800/40 
                        shadow-md shadow-emerald-950/20 
                        transition-all duration-300">
              <svg className="w-10 h-10 md:w-14 md:h-14 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v7m-3-4l3 4 3-4" opacity="0.6" />
              </svg>
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
              Simplicity
            </h3>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-xs">
              One link. No sign-up. No app install. Share details in seconds.
            </p>
          </div>

          {/* Trust Badge */}
          <div className="flex flex-col items-center text-center group">
            <div className="mb-4 p-4 rounded-xl 
                        bg-gradient-to-br from-amber-950/60 to-yellow-950/40 
                        border border-amber-800/40 
                        shadow-md shadow-amber-950/20 
                        transition-all duration-300">
              <svg className="w-10 h-10 md:w-14 md:h-14 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
              Trust
            </h3>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-xs">
              Built with care in Zurich — privacy-first by design.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
