import { useEffect, useRef, useState } from 'react'

export default function Player({ track, tracks }) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [loop, setLoop] = useState(false)
  const [queue, setQueue] = useState([])
  const [queueIndex, setQueueIndex] = useState(0)
  const [currentTrack, setCurrentTrack] = useState(null)

  // build shuffled queue when tracks load
  useEffect(() => {
    if (tracks && tracks.length > 0) {
      const shuffled = [...tracks].sort(() => Math.random() - 0.5)
      setQueue(shuffled)
    }
  }, [tracks])

  // when track prop changes (user clicks a song)
  useEffect(() => {
    if (track) {
      setCurrentTrack(track)
      // find it in queue and set index
      const idx = queue.findIndex(q => q._id === track._id)
      if (idx !== -1) setQueueIndex(idx)
    }
  }, [track])

  // when currentTrack changes, play it
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.load()
      audioRef.current.play()
      setIsPlaying(true)
    }
  }, [currentTrack])

  function playNext() {
    if (queue.length === 0) return
    const nextIndex = (queueIndex + 1) % queue.length
    setQueueIndex(nextIndex)
    setCurrentTrack(queue[nextIndex])
  }

  function playPrev() {
    if (queue.length === 0) return
    const prevIndex = (queueIndex - 1 + queue.length) % queue.length
    setQueueIndex(prevIndex)
    setCurrentTrack(queue[prevIndex])
  }

  function handleEnded() {
    if (loop) {
      // replay current song
      audioRef.current.currentTime = 0
      audioRef.current.play()
    } else {
      playNext()
    }
  }

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

  function handleVolume(e) {
    const val = e.target.value
    audioRef.current.volume = val
    setVolume(val)
  }

  function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00'
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  if (!currentTrack) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#010306] border-t border-[#0a1a2e] px-8 py-3 z-50">

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1e8fff] to-transparent opacity-50" />

      <audio
        ref={audioRef}
        src={currentTrack.uri}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex items-center gap-6">

        {/* track info */}
        <div className="flex items-center gap-3 w-48 flex-shrink-0">
          <div className="w-10 h-10 bg-[#030a18] border border-[#0a1a2e] rounded flex items-center justify-center">
            <div className="w-3 h-3 rounded-full border border-[#1e8fff] opacity-60" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-[#c0dff5] truncate">{currentTrack.title}</p>
            <p className="text-xs text-[#0a3a6a]">{currentTrack.artist?.username}</p>
          </div>
        </div>

        {/* controls */}
        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="flex items-center gap-6">

            {/* prev */}
            <button
              onClick={playPrev}
              className="text-[#0a3a6a] hover:text-[#1e8fff] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <rect x="1" y="1" width="3" height="12"/>
                <polygon points="13,7 5,1 5,13"/>
              </svg>
            </button>

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

            {/* next */}
            <button
              onClick={playNext}
              className="text-[#0a3a6a] hover:text-[#1e8fff] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <rect x="10" y="1" width="3" height="12"/>
                <polygon points="1,7 9,1 9,13"/>
              </svg>
            </button>

            {/* loop toggle */}
            <button
              onClick={() => setLoop(!loop)}
              className={`text-xs tracking-widest transition-colors ${loop ? 'text-[#1e8fff]' : 'text-[#0a3a6a]'}`}
            >
              ↺
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
  )
}