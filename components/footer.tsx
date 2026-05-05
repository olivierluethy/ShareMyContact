import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-950 border-t border-gray-800/50 text-gray-500 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:gap-6 sm:text-sm">

          {/* Copyright */}
          <div>
            © {currentYear} ShareMyContact All rights reserved.
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 sm:gap-8">
            <Link href="/about" className="hover:text-gray-300 transition-colors">
              About
            </Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">
              Privacy
            </Link>
            <Link href="/blog" className="hover:text-gray-300 transition-colors">
              Blog
            </Link>
          </div>

        </div>
      </div>
    </footer>
  )
}
