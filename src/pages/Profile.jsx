import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const API = import.meta.env.VITE_API_URL

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      try {
        const res = await axios.get(`${API}/api/auth/me`, {
          withCredentials: true
        })
        setUser(res.data.user)
      } catch (err) {
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#02060f] flex items-center justify-center">
        <p className="text-[#1e8fff] tracking-widest text-xs animate-pulse">LOADING...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#02060f] flex items-center justify-center">
      <Card className="w-full max-w-md bg-[#030a18] border border-[#0a1a2e] text-[#7aaddb]">
        <CardHeader className="text-center">

          {/* avatar */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-[#0a1a2e] border border-[#1e8fff] flex items-center justify-center text-[#1e8fff] text-3xl font-bold">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          </div>

          <CardTitle className="text-xl tracking-widest text-[#1e8fff]">
            {user?.username}
          </CardTitle>
          <p className="text-xs tracking-[4px] text-[#1e8fff] opacity-50 mt-1">
            {user?.role?.toUpperCase()}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">

          <div className="bg-[#02060f] border border-[#0a1a2e] rounded-md px-4 py-3">
            <p className="text-xs text-[#0a3a6a] tracking-widest mb-1">USERNAME</p>
            <p className="text-sm text-[#7aaddb]">{user?.username}</p>
          </div>

          <div className="bg-[#02060f] border border-[#0a1a2e] rounded-md px-4 py-3">
            <p className="text-xs text-[#0a3a6a] tracking-widest mb-1">EMAIL</p>
            <p className="text-sm text-[#7aaddb]">{user?.email}</p>
          </div>

          <div className="bg-[#02060f] border border-[#0a1a2e] rounded-md px-4 py-3">
            <p className="text-xs text-[#0a3a6a] tracking-widest mb-1">ROLE</p>
            <p className="text-sm text-[#1e8fff] tracking-widest">{user?.role?.toUpperCase()}</p>
          </div>

          <Button
            onClick={() => navigate('/home')}
            className="w-full bg-[#041530] border border-[#1e8fff] text-[#60b8ff] hover:bg-[#0a2a4a] tracking-widest text-xs"
          >
            ← BACK
          </Button>

        </CardContent>
      </Card>
    </div>
  )
}