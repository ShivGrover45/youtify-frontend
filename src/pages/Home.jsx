import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import Player from '@/components/Player'

const API = import.meta.env.VITE_API_URL

export default function Home() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [musics, setMusics] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentTrack, setCurrentTrack] = useState(null)
  const [search, setSearch] = useState('') // ← NEW

  useEffect(() => {
    async function init() {
      try {
        const meRes = await axios.get(`${API}/api/auth/me`, {
          withCredentials: true
        })
        setUser(meRes.data.user)

        const musicRes = await axios.get(`${API}/api/music`, {
          withCredentials: true
        })
        setMusics(musicRes.data.musics)
      } catch (err) {
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  function handleLogout() {
    axios.post(`${API}/api/auth/logout`, {}, { withCredentials: true })
    navigate('/login')
  }

  // ← NEW — filter songs based on search
  const filtered = musics.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-[#02060f] flex items-center justify-center">
        <p className="text-[#1e8fff] tracking-widest text-xs animate-pulse">LOADING...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#02060f] text-[#7aaddb]">

      {/* Top bar */}
      <div className="border-b border-[#0a1a2e] px-8 py-4 flex items-center justify-between">
        <h1 className="text-[#1e8fff] tracking-widest text-lg font-bold">YOUTIFY</h1>
        <div className="flex items-center gap-4">
          {user?.role === 'artist' && (
            <Button
              onClick={() => navigate('/upload')}
              className="bg-[#041530] border border-[#1e8fff] text-[#60b8ff] hover:bg-[#0a2a4a] tracking-widest text-xs"
            >
              + UPLOAD
            </Button>
          )}
          <div className="flex items-center gap-2">
  <div
    onClick={() => navigate('/profile')}
    className="w-8 h-8 rounded-full bg-[#0a1a2e] border border-[#1e8fff] flex items-center justify-center text-[#1e8fff] text-xs font-bold cursor-pointer hover:bg-[#0a2a4a]"
  >
    {user?.username?.charAt(0).toUpperCase()}
  </div>
  <span className="text-xs text-[#0a3a6a] tracking-widest">{user?.username}</span>
</div>
          <button
            onClick={handleLogout}
            className="text-xs text-[#0a3a6a] hover:text-[#1e8fff] tracking-widest"
          >
            LOGOUT
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="px-8 py-6 pb-32">
        <p className="text-xs tracking-[6px] text-[#0a3a6a] mb-4">— all tracks —</p>

        {/* ← NEW search bar */}
        <input
          type="text"
          placeholder="search tracks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-md bg-[#030a18] border border-[#0a1a2e] text-[#7aaddb] placeholder:text-[#0a3a6a] rounded-md px-4 py-2 text-xs focus:outline-none focus:border-[#1e8fff] tracking-widest mb-6"
        />

        {filtered.length === 0 ? ( // ← changed musics to filtered
          <p className="text-[#0a3a6a] text-xs tracking-widest">
            {search ? 'NO TRACKS FOUND' : 'NO TRACKS YET'}
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((music, index) => ( // ← changed musics to filtered
              <div
                key={music._id}
                onClick={() => setCurrentTrack(music)}
                className="flex items-center gap-4 px-4 py-3 border border-transparent hover:border-[#0a1a2e] hover:bg-[#030a18] rounded-md cursor-pointer group"
              >
                <span className="text-[#0a3a6a] text-xs w-6 text-center">{index + 1}</span>

                <div className="w-10 h-10 bg-[#030a18] border border-[#0a1a2e] rounded flex items-center justify-center flex-shrink-0">
                  <div className="w-3 h-3 rounded-full border border-[#1e8fff] opacity-50" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#7aaddb] group-hover:text-[#c0dff5] truncate">{music.title}</p>
                  <p className="text-xs text-[#0a3a6a]">{music.artist?.username}</p>
                </div>

                <button className="opacity-0 group-hover:opacity-100 transition-opacity text-[#1e8fff] text-xs tracking-widest">
                  ▶ PLAY
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Player */}
      <Player track={currentTrack} />

    </div>
  )
}