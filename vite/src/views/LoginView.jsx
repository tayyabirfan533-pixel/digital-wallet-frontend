import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Wallet, Lock, User, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginView() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('admin'); // Pre-filled for instant testing
  const [email, setEmail] = useState('admin@payvault.com');
  const [password, setPassword] = useState('password'); // Pre-filled for instant testing
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) await login(username, password);
      else await register(username, email, password);
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#030712',
      color: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ width: '100%', maxWidth: '420px', margin: '0 auto' }}>
        
        {/* Header Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            backgroundColor: '#34d399',
            color: '#030712',
            padding: '16px',
            borderRadius: '20px',
            marginBottom: '16px',
            boxShadow: '0 10px 25px -5px rgba(52, 211, 153, 0.3)'
          }}>
            <Wallet size={36} />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#f8fafc', marginBottom: '8px' }}>
            {isLogin ? 'Sign in to PayVault' : 'Create Account'}
          </h1>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>
            Pre-filled with demo admin credentials. Just click Sign In!
          </p>
        </div>

        {/* Card Box */}
        <div style={{
          backgroundColor: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
        }}>
          {error && (
            <div style={{
              backgroundColor: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.2)',
              color: '#f43f5e',
              padding: '12px',
              borderRadius: '12px',
              marginBottom: '20px',
              fontSize: '13px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>Username</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: '#64748b' }} />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 44px',
                    backgroundColor: '#030712',
                    border: '1px solid #1e293b',
                    borderRadius: '14px',
                    color: '#f8fafc',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  placeholder="admin"
                />
              </div>
            </div>

            {!isLogin && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: '#64748b' }} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px 14px 44px',
                      backgroundColor: '#030712',
                      border: '1px solid #1e293b',
                      borderRadius: '14px',
                      color: '#f8fafc',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    placeholder="user@example.com"
                  />
                </div>
              </div>
            )}

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: '#64748b' }} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 44px',
                    backgroundColor: '#030712',
                    border: '1px solid #1e293b',
                    borderRadius: '14px',
                    color: '#f8fafc',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  placeholder="password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#34d399',
                color: '#030712',
                border: 'none',
                borderRadius: '14px',
                fontSize: '15px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: '0.2s'
              }}
            >
              <span>{loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Register Account')}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={{ background: 'none', border: 'none', color: '#34d399', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>

          <div style={{
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '12px',
            color: '#64748b'
          }}>
            <ShieldCheck size={16} color="#34d399" />
            <span>Fully functional offline sandbox mode</span>
          </div>
        </div>

      </div>
    </div>
  );
}