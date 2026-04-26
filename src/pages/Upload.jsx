import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

export default function Upload() {
  const [title, setTitle] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!file) {
      setError('Please select an audio file')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('music', file)

      await axios.post(`${API}/api/music/upload`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setSuccess('Song uploaded successfully!')
      setTitle('')
      setFile(null)
      // reset file input
      document.getElementById('audioInput').value = ''
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#02060f] flex items-center justify-center">
      <Card className="w-full max-w-md bg-[#030a18] border border-[#0a1a2e] text-[#7aaddb]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl tracking-widest text-[#1e8fff]">
            UPLOAD
          </CardTitle>
          <p className="text-xs tracking-[6px] text-[#0a3a6a] mt-1">add to the void</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-1">
              <Label className="text-[#1e8fff] text-xs tracking-widest">TITLE</Label>
              <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="enter song title"
                required
                className="bg-[#02060f] border-[#0a1a2e] text-[#7aaddb] placeholder:text-[#0a2a4a] focus:border-[#1e8fff]"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-[#1e8fff] text-xs tracking-widest">AUDIO FILE</Label>
              <input
                id="audioInput"
                type="file"
                accept="audio/mp3,audio/*"
                onChange={e => setFile(e.target.files[0])}
                required
                className="w-full text-xs text-[#7aaddb] bg-[#02060f] border border-[#0a1a2e] rounded-md px-3 py-2 file:mr-3 file:py-1 file:px-3 file:border-0 file:text-xs file:bg-[#041530] file:text-[#60b8ff] file:border file:border-[#1e8fff] cursor-pointer"
              />
              <p className="text-xs text-[#0a3a6a]">mp3 files only</p>
            </div>

            {error && <p className="text-red-500 text-xs text-center">{error}</p>}
            {success && <p className="text-[#1e8fff] text-xs text-center">{success}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#041530] border border-[#1e8fff] text-[#60b8ff] hover:bg-[#0a2a4a] tracking-widest text-xs"
            >
              {loading ? 'UPLOADING...' : 'UPLOAD'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}