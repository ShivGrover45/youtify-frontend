import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL

export default function Login() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: '',
    password: ''
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await axios.post(`${API}/api/auth/login`, form, {
        withCredentials: true
      })
      navigate('/home')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#02060f] flex items-center justify-center">
      <Card className="w-full max-w-md bg-[#030a18] border border-[#0a1a2e] text-[#7aaddb]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl tracking-widest text-[#1e8fff] font-cinzel">
            YOUTIFY
          </CardTitle>
          <p className="text-xs tracking-[6px] text-[#0a3a6a] mt-1">six eyes</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-1">
              <Label className="text-[#1e8fff] text-xs tracking-widest">USERNAME</Label>
              <Input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="enter username"
                required
                className="bg-[#02060f] border-[#0a1a2e] text-[#7aaddb] placeholder:text-[#0a2a4a] focus:border-[#1e8fff]"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-[#1e8fff] text-xs tracking-widest">PASSWORD</Label>
              <Input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="enter password"
                required
                className="bg-[#02060f] border-[#0a1a2e] text-[#7aaddb] placeholder:text-[#0a2a4a] focus:border-[#1e8fff]"
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs text-center">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#041530] border border-[#1e8fff] text-[#60b8ff] hover:bg-[#0a2a4a] tracking-widest text-xs"
            >
              {loading ? 'LOGGING IN...' : 'LOGIN'}
            </Button>

            <p className="text-center text-xs text-[#0a3a6a]">
              don't have an account?{' '}
              <span
                onClick={() => navigate('/register')}
                className="text-[#1e8fff] cursor-pointer hover:underline"
              >
                register
              </span>
            </p>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}