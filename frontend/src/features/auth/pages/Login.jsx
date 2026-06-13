import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hook/useAuth';
import { GoogleButton } from '../../../components/ui/google-button';
import { Eye, EyeOff, ArrowRight, Store, User, ShoppingBag } from 'lucide-react';
import { ThemeToggle } from '../../../components/ThemeToggle';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [errorMsg, setErrorMsg] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('error') === 'google_auth_failed'
      ? 'Google authentication failed. Please try again.'
      : '';
  });

  const { handleLogin, loading, error, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === 'seller' ? '/seller/dashboard' : '/', { replace: true });
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!formData.email || !formData.password) {
      setErrorMsg('Please fill in all fields');
      return;
    }
    try {
      const result = await handleLogin(formData);
      if (result.success) {
        const loggedInUser = result.data?.user || result.data;
        navigate(loggedInUser?.role === 'seller' ? '/seller/dashboard' : '/', { replace: true });
      } else {
        setErrorMsg(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Login failed. Please try again.');
    }
  };

  const ringClass = (field) =>
    focusedField === field ? 'shadow-[0_0_0_2px_rgba(113,113,122,0.3)]' : '';

  return (
    <div className="h-screen bg-bento-bg flex font-['Noto_Sans'] antialiased overflow-hidden">

      {/* ── LEFT BRAND PANEL ──────────────────────────────────────────── */}
      <div className="hidden lg:flex w-[44%] bg-bento-card border-r border-bento-border flex-col justify-between p-12 relative overflow-hidden">

        {/* Background depth layers */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-bento-border" />
          <div className="absolute -top-48 -left-48 w-[600px] h-[600px] rounded-full bg-zinc-400/5 blur-[140px] animate-drift" />
          <div className="absolute -bottom-32 -right-24 w-[450px] h-[450px] rounded-full bg-zinc-500/5 blur-[110px] animate-drift-slow" />
        </div>

        {/* Decorative floating product-style cards */}
        <div className="absolute right-[-18px] top-[18%] w-40 h-48 rounded-[16px] bg-bento-card border border-bento-border shadow-bento rotate-[-7deg] pointer-events-none opacity-50 flex flex-col overflow-hidden">
          <div className="flex-1 bg-bento-card-sunken border-b border-bento-border shadow-bento-sunken" />
          <div className="p-3">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-[5px] bg-bento-card-sunken border border-bento-border-light shadow-bento-sunken flex items-center justify-center">
                <User className="h-3 w-3 text-bento-text-muted" />
              </div>
              <p className="text-[9px] font-bold text-bento-text">Buyer</p>
            </div>
            <p className="text-[7px] text-bento-text-faint mt-1 leading-tight">Shop & discover curated items</p>
          </div>
        </div>
        <div className="absolute right-[20px] top-[40%] w-36 h-44 rounded-[16px] bg-bento-card border border-bento-border shadow-bento rotate-[5deg] pointer-events-none opacity-35 flex flex-col overflow-hidden">
          <div className="flex-1 bg-bento-card-sunken border-b border-bento-border shadow-bento-sunken" />
          <div className="p-3">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-[5px] bg-bento-text border border-bento-border shadow-bento flex items-center justify-center">
                <Store className="h-3 w-3 text-bento-bg" />
              </div>
              <p className="text-[9px] font-bold text-bento-text">Seller</p>
            </div>
            <p className="text-[7px] text-bento-text-faint mt-1 leading-tight">List, manage & grow your store</p>
          </div>
        </div>
        <div className="absolute right-[-8px] bottom-[16%] w-32 h-40 rounded-[14px] bg-bento-card-sunken border border-bento-border shadow-bento-sunken rotate-[-3deg] pointer-events-none opacity-25" />

        {/* Brand */}
        <div className="relative z-10 animate-slide-up-fade">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-[8px] bg-bento-card-sunken border border-bento-border-light shadow-bento-sunken flex items-center justify-center">
              <ShoppingBag className="h-4 w-4 text-bento-text-muted" />
            </div>
            <span className="text-[20px] font-bold tracking-tight text-bento-text select-none">snitch.</span>
          </div>
        </div>

        {/* Center statement */}
        <div className="relative z-10 space-y-7 animate-slide-up-fade-1">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 border border-bento-border-light px-3 py-1.5 rounded-full bg-bento-card-sunken shadow-bento-sunken">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-zinc-500" />
              </span>
              <span className="text-[9px] text-bento-text-muted tracking-widest uppercase font-bold font-['DM_Mono']">Member Access</span>
            </div>
            <h1 className="text-[48px] font-bold leading-[1.0] tracking-[-0.03em] text-bento-text">
              Your<br/>market.<br/>Your rules.
            </h1>
            <p className="text-[13px] text-bento-text-muted leading-relaxed font-light max-w-[250px]">
              Sign in to shop from independent sellers or manage your own store on snitch.
            </p>
          </div>

          {/* What awaits cards */}
          <div className="space-y-2.5">
            {[
              {
                icon: User,
                title: 'Buyer Account',
                desc: 'Shop the curated catalog, save favourites, track orders.',
                sunken: true,
              },
              {
                icon: Store,
                title: 'Seller Account',
                desc: 'List products, manage stock, and grow your brand.',
                sunken: false,
              }
            ].map((card) => (
              <div
                key={card.title}
                className={`flex items-start gap-3 p-3.5 rounded-[12px] border transition-all ${
                  card.sunken
                    ? 'bg-bento-card-sunken border-bento-border-light shadow-bento-sunken'
                    : 'bg-bento-card border-bento-border shadow-bento'
                }`}
              >
                <div className={`h-8 w-8 rounded-[8px] border flex items-center justify-center shrink-0 ${
                  card.sunken
                    ? 'bg-bento-card border-bento-border shadow-bento'
                    : 'bg-bento-text border-bento-border shadow-bento'
                }`}>
                  <card.icon className={`h-4 w-4 ${card.sunken ? 'text-bento-text-muted' : 'text-bento-bg'}`} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-bento-text">{card.title}</p>
                  <p className="text-[10px] text-bento-text-muted font-light mt-0.5 leading-snug">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 animate-slide-up-fade-2">
          <p className="text-[9px] text-bento-text-faint font-['DM_Mono'] tracking-wider uppercase">
            © 2026 SNITCH &nbsp;·&nbsp; SYSTEM v1.02
          </p>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-bento-bg relative overflow-hidden">
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.018] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(var(--bento-border) 1px, transparent 1px), linear-gradient(90deg, var(--bento-border) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        {/* Top bar */}
        <div className="flex items-center justify-between px-8 pt-4 relative z-10 shrink-0">
          <Link to="/" className="text-[18px] font-bold tracking-tight text-bento-text select-none lg:hidden">
            snitch.
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-[12px] text-bento-text-muted hidden sm:block">
              No account?{' '}
              <Link to="/register" className="text-bento-text font-bold hover:underline underline-offset-4 transition-all">
                Register
              </Link>
            </span>
            <ThemeToggle />
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-2 relative z-10">
          <div className="w-full max-w-[420px] space-y-3">

            {/* Heading */}
            <div className="space-y-0.5 animate-slide-up-fade">
              <p className="text-[10px] font-['DM_Mono'] text-bento-text-faint uppercase tracking-[0.2em] font-semibold">
                Member Access
              </p>
              <h2 className="text-[24px] font-bold tracking-[-0.02em] text-bento-text leading-tight">
                Welcome back.
              </h2>
              <p className="text-[12px] text-bento-text-muted font-light">
                Sign in to continue to your account.
              </p>
            </div>

            {/* Google OAuth */}
            <div className="animate-slide-up-fade-1">
              <GoogleButton href={`${import.meta.env.VITE_API_URL || ""}/api/auth/google`} />
            </div>

            {/* Divider */}
            <div className="animate-slide-up-fade-2 relative flex items-center gap-3">
              <div className="flex-1 h-px bg-bento-border-light" />
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-bento-border" />
                <span className="text-[9px] text-bento-text-faint uppercase tracking-[0.18em] font-['DM_Mono']">or with email</span>
                <div className="h-1 w-1 rounded-full bg-bento-border" />
              </div>
              <div className="flex-1 h-px bg-bento-border-light" />
            </div>

            {/* ── FORM CARD ── */}
            <form onSubmit={handleSubmit} className="animate-slide-up-fade-3">
              <div className="bg-bento-card border border-bento-border rounded-[22px] shadow-bento p-4 space-y-3 relative overflow-hidden">
                <div className="absolute top-0 left-4 right-4 h-[1px] bg-bento-border pointer-events-none" />

                {/* Email */}
                <div className="space-y-1">
                  <label htmlFor="email" className="text-[10px] font-bold text-bento-text-muted uppercase tracking-[0.14em] font-['DM_Mono']">
                    Email Address
                  </label>
                  <div className={`rounded-[12px] transition-all duration-200 ${ringClass('email')}`}>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      disabled={loading}
                      autoFocus
                      className="w-full h-[40px] rounded-[12px] border border-bento-border bg-bento-card-sunken px-4 text-[12px] text-bento-text placeholder:text-bento-text-faint shadow-bento-sunken focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label htmlFor="password" className="text-[10px] font-bold text-bento-text-muted uppercase tracking-[0.14em] font-['DM_Mono']">
                    Password
                  </label>
                  <div className={`relative rounded-[12px] transition-all duration-200 ${ringClass('password')}`}>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      disabled={loading}
                      className="w-full h-[40px] rounded-[12px] border border-bento-border bg-bento-card-sunken px-4 pr-12 text-[12px] text-bento-text placeholder:text-bento-text-faint shadow-bento-sunken focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-[7px] border border-bento-border bg-bento-card shadow-bento-btn hover:bg-bento-card-hover active:translate-y-[calc(-50%+1px)] active:shadow-bento-btn-active flex items-center justify-center text-bento-text-faint hover:text-bento-text transition-all cursor-pointer focus:outline-none"
                    >
                      {showPassword
                        ? <EyeOff className="h-3.5 w-3.5" strokeWidth={1.5} />
                        : <Eye className="h-3.5 w-3.5" strokeWidth={1.5} />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {(errorMsg || error) && (
                  <div className="text-[12px] text-red-400 bg-red-500/8 border border-red-500/20 px-4 py-3 rounded-[10px] shadow-bento-sunken">
                    {errorMsg || (typeof error === 'string' ? error : error?.message) || 'Something went wrong'}
                  </div>
                )}

                <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-bento-border-light/50 pointer-events-none" />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full h-[46px] rounded-[14px] bg-bento-text text-bento-bg text-[13px] font-bold tracking-wide overflow-hidden shadow-bento hover:opacity-95 active:translate-y-[2px] active:shadow-bento-btn-active transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-3 group"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <>Sign In <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
                )}
              </button>
            </form>

            {/* Footer link mobile */}
            <p className="text-center text-[11px] text-bento-text-muted sm:hidden animate-slide-up-fade-4">
              No account?{' '}
              <Link to="/register" className="text-bento-text font-bold hover:underline underline-offset-4">
                Register
              </Link>
            </p>
          </div>
        </div>

        {/* Decorative corner mark */}
        <div className="absolute bottom-6 right-8 pointer-events-none hidden lg:block">
          <p className="text-[8px] text-bento-text-faint font-['DM_Mono'] tracking-widest uppercase">
            SNITCH AUTH v1.02
          </p>
        </div>
      </div>
    </div>
  );
}