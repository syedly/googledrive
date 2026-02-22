import Link from 'next/link'

export const metadata = {
  title: 'CloudVault',
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
      <div className="max-w-3xl p-8">
        <h1 className="text-5xl font-bold mb-4">CloudVault</h1>
        <p className="text-slate-300 mb-6">Personal cloud storage — upload, organize, and share files with a Drive-like experience.</p>

        <div className="flex gap-4">
          <Link href="/login" className="px-4 py-2 bg-emerald-500 text-black rounded">Sign in</Link>
          <Link href="/signup" className="px-4 py-2 border border-slate-700 rounded">Create account</Link>
          <Link href="/dashboard" className="px-4 py-2 border border-slate-700 rounded">Go to Dashboard</Link>
        </div>

        <section className="mt-8">
          <h2 className="text-2xl mb-2">Features</h2>
          <ul className="list-disc ml-6 text-slate-300">
            <li>Upload files (images, PDFs, media) with Cloudinary</li>
            <li>Star, rename, move to trash, and delete files</li>
            <li>Search, sort, and toggle between list/grid views</li>
            <li>Simple auth with email/password</li>
          </ul>
        </section>
      </div>
    </main>
  )
}
