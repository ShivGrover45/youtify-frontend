import { useEffect, useRef, useState } from 'react'

export default function Player({ track }) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [search, setSearch] = useState('')
  // when track changes, auto play
  useEffect(() => {
    if (track) {
      audioRef.current.load()
      audioRef.current.play()
      setIsPlaying(true)
    }
  }, [track])

  function togglePlay() {
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  function handleTimeUpdate() {
    const current = audioRef.current.currentTime
    const dur = audioRef.current.duration
    setProgress((current / dur) * 100)
    setDuration(dur)
  }

  function handleSeek(e) {
    const newTime = (e.target.value / 100) * duration
    audioRef.current.currentTime = newTime
    setProgress(e.target.value)
  }

  function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00'
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }
  function handleVolume(e) {
  const val = e.target.value
  audioRef.current.volume = val
  setVolume(val)
}
  if (!track) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#010306] border-t border-[#0a1a2e] px-8 py-3 z-50">
        
      {/* gradient line on top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1e8fff] to-transparent opacity-50" />
      

      <audio
        ref={audioRef}
        src={track.uri}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="flex items-center gap-6">

        {/* track info */}
        <div className="flex items-center gap-3 w-48 flex-shrink-0">
          <div className="w-10 h-10 bg-[#030a18] border border-[#0a1a2e] rounded flex items-center justify-center">
            <div className="w-3 h-3 rounded-full border border-[#1e8fff] opacity-60" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-[#c0dff5] truncate">{track.title}</p>
            <p className="text-xs text-[#0a3a6a]">{track.artist?.username}</p>
          </div>
        </div>

        {/* controls */}
        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="flex items-center gap-6">
            {/* play/pause */}
            <button
              onClick={togglePlay}
              className="w-8 h-8 rounded-full border border-[#1e8fff] bg-[#04152e] flex items-center justify-center text-[#1e8fff] hover:bg-[#0a2a4a] transition-colors"
            >
              {isPlaying ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="#1e8fff">
                  <rect x="1" y="1" width="3" height="10"/>
                  <rect x="8" y="1" width="3" height="10"/>
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="#1e8fff">
                  <polygon points="2,1 11,6 2,11"/>
                </svg>
              )}
            </button>
          </div>

          {/* progress bar */}
          <div className="w-full flex items-center gap-3">
            <span className="text-xs text-[#0a3a6a] font-mono w-8 text-right">
              {formatTime(audioRef.current?.currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="flex-1 h-px appearance-none bg-[#0a1a2e] cursor-pointer accent-[#1e8fff]"
            />
            <span className="text-xs text-[#0a3a6a] font-mono w-8">
              {formatTime(duration)}
            </span>
          </div>
          {/* volume */}
<div className="flex items-center gap-2 w-32 flex-shrink-0">
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <polygon points="1,5 5,5 9,2 9,12 5,9 1,9" fill="#1e8fff" opacity="0.6"/>
    <path d="M10.5 4.5C11.8 5.5 11.8 8.5 10.5 9.5" stroke="#1e8fff" stroke-width="1" opacity="0.6"/>
  </svg>
  <input
    type="range"
    min="0"
    max="1"
    step="0.01"
    value={volume}
    onChange={handleVolume}
    className="flex-1 h-px appearance-none bg-[#0a1a2e] cursor-pointer accent-[#1e8fff]"
  />
</div>
        </div>

      </div>
    </div>
  )
}