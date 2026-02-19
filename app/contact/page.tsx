"use client"

import { useState } from "react"
import { 
  Mail, 
  User, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Zap,
  Loader2,
  AlertCircle
} from "lucide-react"

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage("")

    const formData = new FormData(e.currentTarget)

    try {
      // ACHTUNG: Ersetze dies durch deine echte PHP-URL (z.B. https://api.deineseite.ch)
      const response = await fetch("https://sharemycontact/contact.php", {
        method: "POST",
        body: formData, // Schickt die Daten als klassischen POST-Request
      })

      const result = await response.json()

      if (result.success) {
        setStatus('success')
      } else {
        setStatus('error')
        setErrorMessage(result.message || "Something went wrong.")
      }
    } catch (error) {
      setStatus('error')
      setErrorMessage("Could not connect to the server. Please try again later.")
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white py-20 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center gap-4 mb-6">
            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20"><Zap className="w-6 h-6 text-indigo-400" /></div>
            <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20"><ShieldCheck className="w-6 h-6 text-purple-400" /></div>
            <div className="p-3 rounded-2xl bg-pink-500/10 border border-pink-500/20"><Sparkles className="w-6 h-6 text-pink-400" /></div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
            Let's build something fast.
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Questions about features or security? Olivier is ready to help.
          </p>
        </div>

        <div className="w-full">
          {status !== 'success' ? (
            <form onSubmit={handleSubmit} className="space-y-6 bg-white/[0.03] backdrop-blur-sm border border-white/10 p-6 md:p-10 rounded-3xl shadow-2xl">
              
              {/* Error Alert */}
              {status === 'error' && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-sm font-medium">{errorMessage}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-indigo-400" /> Name
                  </label>
                  <input 
                    name="name"
                    required
                    type="text" 
                    placeholder="Your Name"
                    className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-purple-400" /> Email
                  </label>
                  <input 
                    name="email"
                    required
                    type="email" 
                    placeholder="email@example.com"
                    className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-pink-400" /> Message
                </label>
                <textarea 
                  name="message"
                  required
                  rows={5}
                  placeholder="How can I help you?"
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                />
              </div>

              <button 
                disabled={status === 'loading'}
                type="submit"
                className="w-full group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg"
              >
                {status === 'loading' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    Send message
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Success State */
            <div className="bg-indigo-500/5 border border-indigo-500/20 p-12 rounded-3xl text-center animate-in fade-in zoom-in duration-500">
              <CheckCircle2 className="w-16 h-16 text-indigo-400 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-white mb-3">Sent successfully!</h3>
              <p className="text-gray-400 text-lg">Thank you for your trust. I will get back to you soon.</p>
              <button 
                onClick={() => setStatus('idle')}
                className="mt-8 px-6 py-2 rounded-full border border-gray-800 text-sm text-gray-400 hover:text-white transition-all"
              >
                Send another message
              </button>
            </div>
          )}
        </div>
        <p className="text-center mt-12 text-sm text-gray-500 italic font-mono">"Done is better than perfect."</p>
      </div>
    </main>
  )
}
