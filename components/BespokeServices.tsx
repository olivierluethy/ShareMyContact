import Link from "next/link"

export function BespokeServices() {
  return (
    <section className="bg-gradient-to-b from-gray-950 to-black py-12 sm:py-16 md:py-20 border-t border-indigo-900/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-10">
          {/* Left Content */}
          <div className="max-w-3xl">
            <div className="mb-4 sm:mb-6 h-1 w-12 sm:w-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"></div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-3 sm:mb-4">
              Need More?
            </h2>

            <p className="text-base sm:text-xl text-gray-300 leading-relaxed">
              We provide <span className="font-semibold text-indigo-400">bespoke services</span>{" "}
              for clients who have more advanced feature needs.
            </p>
          </div>

          {/* Right CTA */}
          <div className="md:flex-shrink-0">
            <Link
              href="/contact"
              className="inline-flex w-full md:w-auto items-center justify-center gap-3 px-6 py-3.5 sm:px-8 sm:py-4
                         bg-gradient-to-r from-indigo-600 to-purple-600
                         hover:from-indigo-500 hover:to-purple-500
                         text-white font-semibold text-base sm:text-lg
                         rounded-xl shadow-lg shadow-indigo-900/30
                         transition-all duration-300"
            >
              Contact Us
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
