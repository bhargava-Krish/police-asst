import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Activity,
  ArrowLeft,
  Bell,
  Car,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  LayoutGrid,
  Lock,
  LogOut,
  Menu,
  MessageSquare,
  Radio,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
  User,
  UserMinus,
  X,
} from 'lucide-react'
import api from '../api/client.js'

const COMMON_ITEMS = [
  { to: '/', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/cases', label: 'Case Management', icon: FolderOpen },
  { to: '/fir', label: 'FIR Assistant', icon: FileText },
  { to: '/search', label: 'Case Search', icon: Search },
  { to: '/criminals', label: 'Criminal Search', icon: ShieldAlert },
  { to: '/missing-persons', label: 'Missing Persons', icon: UserMinus },
  { to: '/vehicles', label: 'Vehicle Search', icon: Car },
  { to: '/reports', label: 'Reports & Evidence', icon: FileSpreadsheet },
  { to: '/profile', label: 'User Profile', icon: User },
]

const ADMIN_ITEMS = [
  { to: '/assistant', label: 'AI Assistant', icon: MessageSquare },
  { to: '/admin', label: 'Admin Panel', icon: Shield },
]

const OFFICER_ITEMS = [
  { to: '/assistant', label: 'AI Assistant', icon: MessageSquare },
  { action: 'alerts', label: 'Emergency Alerts', icon: Bell },
]

function NavEntry({ item, isCollapsed, isMobile, onNavigate, onAlerts }) {
  const styleMode = item.action === 'alerts'
    ? { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)' }
    : item.label === 'Admin Panel'
      ? { color: '#c4b5fd', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.2)' }
      : { color: '#fbbf24', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.18)' }

  if (item.action === 'alerts') {
    return (
      <button
        type="button"
        onClick={onAlerts}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: isCollapsed && !isMobile ? '9px' : '10px 12px',
          borderRadius: '10px',
          border: `1px solid ${styleMode.border}`,
          background: styleMode.bg,
          color: styleMode.color,
          fontSize: '12px',
          fontWeight: 700,
          cursor: 'pointer',
          justifyContent: isCollapsed && !isMobile ? 'center' : 'flex-start',
        }}
      >
        <item.icon size={15} />
        {(!isCollapsed || isMobile) && <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>}
      </button>
    )
  }

  return (
    <NavLink
      to={item.to}
      end={item.end}
      style={{ textDecoration: 'none', display: 'block' }}
      onClick={onNavigate}
    >
      {({ isActive }) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: isCollapsed && !isMobile ? '9px' : '10px 12px',
            borderRadius: '10px',
            border: isActive ? `1px solid ${styleMode.border}` : '1px solid transparent',
            background: isActive ? styleMode.bg : 'transparent',
            color: isActive ? styleMode.color : '#64748b',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            justifyContent: isCollapsed && !isMobile ? 'center' : 'flex-start',
            position: 'relative',
          }}
        >
          {isActive && !isCollapsed && !isMobile && (
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: '22%',
                bottom: '22%',
                width: '3px',
                borderRadius: '0 2px 2px 0',
                background: styleMode.color,
              }}
            />
          )}
          <item.icon size={15} style={{ flexShrink: 0 }} />
          {(!isCollapsed || isMobile) && <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>}
          {isActive && (!isCollapsed || isMobile) && <ChevronRight size={12} style={{ opacity: 0.5 }} />}
        </div>
      )}
    </NavLink>
  )
}

function EmergencyModal({ onClose }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(2,6,23,0.78)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          borderRadius: '18px',
          border: '1px solid rgba(239,68,68,0.28)',
          background: 'linear-gradient(180deg, rgba(15,23,42,0.98), rgba(2,6,23,0.98))',
          boxShadow: '0 30px 80px rgba(0,0,0,0.65)',
          overflow: 'hidden',
        }}
      >
        <div style={{ height: '3px', background: 'linear-gradient(90deg, transparent, #ef4444, transparent)' }} />
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div>
              <p style={{ margin: 0, fontSize: '11px', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 800 }}>
                Emergency Alert
              </p>
              <h2 style={{ margin: '6px 0 0', fontSize: '18px', color: '#f8fafc' }}>Active incident feed</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{
                border: '1px solid rgba(71,85,105,0.6)',
                background: 'rgba(30,41,59,0.5)',
                color: '#cbd5e1',
                borderRadius: '8px',
                padding: '6px',
                cursor: 'pointer',
                display: 'flex',
              }}
            >
              <X size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gap: '12px', marginTop: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f87171', fontWeight: 700 }}>
              <Activity size={15} />
              Control room alerting is active.
            </div>
            <p style={{ margin: 0, color: '#94a3b8', lineHeight: 1.6 }}>
              This layout now opens correctly and can be extended to show live alerts once the frontend deploy is stable.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '11px 14px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Acknowledged
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(71,85,105,0.6)',
                background: 'rgba(30,41,59,0.4)',
                color: '#cbd5e1',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [now, setNow] = useState(new Date())
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [emergencyOpen, setEmergencyOpen] = useState(false)

  useEffect(() => {
    api
      .get('/auth/me')
      .then((response) => setUser(response.data))
      .catch(() => setUser(null))
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    function handleResize() {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      if (!mobile) {
        setMobileDrawerOpen(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isAdmin = user?.role === 'admin'
  const navItems = isAdmin ? [...COMMON_ITEMS, ...ADMIN_ITEMS] : [...COMMON_ITEMS, ...OFFICER_ITEMS]
  const sidebarWidth = sidebarCollapsed ? '76px' : '284px'

  function logout() {
    localStorage.clear()
    navigate('/login')
  }

  function closeMobileDrawer() {
    setMobileDrawerOpen(false)
  }

  return (
    <>
      {emergencyOpen && <EmergencyModal onClose={() => setEmergencyOpen(false)} />}

      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          background: '#020617',
          color: '#f1f5f9',
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        {isMobile && mobileDrawerOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 40 }}>
            <div
              onClick={closeMobileDrawer}
              style={{ position: 'absolute', inset: 0, background: 'rgba(2,6,23,0.78)', backdropFilter: 'blur(6px)' }}
            />
            <aside
              style={{
                position: 'relative',
                width: '284px',
                maxWidth: '82vw',
                height: '100%',
                background: 'linear-gradient(180deg, rgba(10,15,30,0.99), rgba(8,12,26,0.99))',
                borderRight: '1px solid rgba(51,65,85,0.38)',
                zIndex: 41,
                display: 'flex',
                flexDirection: 'column',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div style={{ padding: '16px', borderBottom: '1px solid rgba(51,65,85,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Shield size={20} color={isAdmin ? '#a78bfa' : '#f59e0b'} />
                  <div>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 800, letterSpacing: '0.05em' }}>Police AI</p>
                    <p style={{ margin: 0, fontSize: '9px', color: '#475569', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Command Console</p>
                  </div>
                </div>
                <button type="button" onClick={closeMobileDrawer} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
                  <X size={18} />
                </button>
              </div>

              {user && (
                <div style={{ margin: '12px', padding: '14px', borderRadius: '14px', background: 'rgba(2,6,23,0.6)', border: '1px solid rgba(51,65,85,0.45)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <span style={{ fontSize: '8px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>Officer ID</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '8px', color: '#10b981', fontFamily: 'monospace', fontWeight: 700 }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                      Online
                    </span>
                  </div>
                  <p style={{ margin: '10px 0 0', fontSize: '12px', fontWeight: 700, color: '#f8fafc' }}>{user.full_name || user.name || 'Officer'}</p>
                  <p style={{ margin: '4px 0 0', fontSize: '9px', fontFamily: 'monospace', color: '#64748b' }}>Role: {isAdmin ? 'Administrator' : 'Officer'}</p>
                </div>
              )}

              <nav style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {navItems.map((item) => (
                    <NavEntry
                      key={item.to || item.label}
                      item={item}
                      isCollapsed={false}
                      isMobile={true}
                      onNavigate={closeMobileDrawer}
                      onAlerts={() => {
                        setEmergencyOpen(true)
                        closeMobileDrawer()
                      }}
                    />
                  ))}
                </div>
              </nav>

              <div style={{ padding: '12px', borderTop: '1px solid rgba(51,65,85,0.35)' }}>
                <button
                  type="button"
                  onClick={() => {
                    closeMobileDrawer()
                    logout()
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid rgba(239,68,68,0.2)',
                    background: 'rgba(239,68,68,0.06)',
                    color: '#f87171',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </aside>
          </div>
        )}

        {!isMobile && (
          <aside
            style={{
              width: sidebarWidth,
              flexShrink: 0,
              background: 'rgba(10,15,30,0.95)',
              borderRight: '1px solid rgba(51,65,85,0.4)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              transition: 'width 0.25s ease',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div style={{ padding: '18px 16px', borderBottom: '1px solid rgba(51,65,85,0.35)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isAdmin ? 'rgba(167,139,250,0.1)' : 'rgba(245,158,11,0.1)', border: `1px solid ${isAdmin ? 'rgba(167,139,250,0.2)' : 'rgba(245,158,11,0.2)'}` }}>
                <Shield size={18} color={isAdmin ? '#a78bfa' : '#f59e0b'} />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Police AI</p>
                  <p style={{ margin: 0, fontSize: '9px', color: '#334155', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>TS Command Console</p>
                </div>
              )}
              <button
                type="button"
                onClick={() => setSidebarCollapsed((value) => !value)}
                style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
              >
                <Menu size={14} />
              </button>
            </div>

            {user && !sidebarCollapsed && (
              <div style={{ margin: '12px', padding: '14px', borderRadius: '12px', background: 'rgba(2,6,23,0.6)', border: '1px solid rgba(51,65,85,0.4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '8px', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>Officer ID</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '8px', color: '#10b981', fontFamily: 'monospace', fontWeight: 700 }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                    Online
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: '#f8fafc' }}>{user.full_name || user.name || 'Officer'}</p>
                <p style={{ margin: '4px 0 0', fontSize: '9px', fontFamily: 'monospace', color: '#64748b' }}>Role: {isAdmin ? 'Administrator' : 'Officer'}</p>
              </div>
            )}

            <nav style={{ flex: 1, padding: '8px', overflowY: 'auto', overflowX: 'hidden' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {navItems.map((item) => (
                  <NavEntry
                    key={item.to || item.label}
                    item={item}
                    isCollapsed={sidebarCollapsed}
                    isMobile={false}
                    onNavigate={undefined}
                    onAlerts={() => setEmergencyOpen(true)}
                  />
                ))}
              </div>
            </nav>

            <div style={{ padding: '8px', borderTop: '1px solid rgba(51,65,85,0.35)' }}>
              <button
                type="button"
                onClick={logout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  gap: '10px',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid transparent',
                  background: 'none',
                  color: '#475569',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <LogOut size={15} style={{ flexShrink: 0 }} />
                {!sidebarCollapsed && <span>Sign Out</span>}
              </button>
            </div>
          </aside>
        )}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <header
            style={{
              height: isMobile ? '54px' : '60px',
              flexShrink: 0,
              background: 'rgba(10,15,30,0.9)',
              borderBottom: '1px solid rgba(51,65,85,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: isMobile ? '0 14px' : '0 28px',
              backdropFilter: 'blur(20px)',
              position: 'sticky',
              top: 0,
              zIndex: 20,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {isMobile && (
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(true)}
                  style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                  title="Open menu"
                >
                  <Menu size={20} />
                </button>
              )}

              {location.pathname !== '/' && (
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(51,65,85,0.5)',
                    borderRadius: '8px',
                    padding: isMobile ? '5px 10px' : '6px 12px',
                    color: '#cbd5e1',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <ArrowLeft size={13} />
                  Back
                </button>
              )}

              <div>
                <h1 style={{ margin: 0, fontSize: isMobile ? '11px' : '13px', fontWeight: 900, color: '#f8fafc', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {isAdmin ? 'HQ Command' : 'Officer Console'}
                </h1>
                {!isMobile && (
                  <p style={{ margin: '2px 0 0', fontSize: '9px', color: '#334155', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                    Secure Session · {now.toLocaleTimeString('en-IN', { hour12: false })} IST
                  </p>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '8px' }}>
              {!isMobile && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '8px', padding: '5px 10px' }}>
                  <Lock size={10} color="#10b981" />
                  <span style={{ fontSize: '9px', color: '#10b981', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.08em' }}>ENCRYPTED</span>
                </div>
              )}

              {!isMobile && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(2,6,23,0.8)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: '8px', padding: '5px 10px' }}>
                  <Radio size={10} color="#3b82f6" />
                  <span style={{ fontSize: '9px', color: '#3b82f6', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.08em' }}>LIVE</span>
                </div>
              )}

              {!isMobile && isAdmin && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(167,139,250,0.07)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: '8px', padding: '5px 10px', color: '#a78bfa', fontSize: '9px', fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                  <Sparkles size={10} />
                  Admin
                </div>
              )}

              <button
                type="button"
                onClick={() => setEmergencyOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(220,38,38,0.08))',
                  border: '1px solid rgba(239,68,68,0.35)',
                  borderRadius: '8px',
                  padding: isMobile ? '7px' : '5px 14px',
                  color: '#ef4444',
                  cursor: 'pointer',
                  fontSize: '10px',
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                <Bell size={12} />
                {!isMobile && 'Emergency'}
              </button>
            </div>
          </header>

          <main style={{ flex: 1, overflowY: 'auto', background: '#020617' }}>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  )
}
