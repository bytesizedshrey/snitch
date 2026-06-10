import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hook/useAuth';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent } from '../../../components/ui/card';
import { GoogleButton } from '../../../components/ui/google-button';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const { handleLogin, loading, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'google_auth_failed') {
      setErrorMsg('Google authentication failed. Please try again.');
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
        if (loggedInUser?.role === 'seller') {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else {
        setErrorMsg(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-['Noto_Sans']">
      <div className="sm:mx-auto sm:w-full sm:max-w-[400px]">
        <Card className="p-6">
          <div className="mb-8 text-center">
            <h2 className="text-[24px] font-light text-primary mb-1 tracking-tight selection:bg-neutral-400">Welcome Back</h2>
            <p className="text-[13px] text-[#666666] selection:bg-neutral-400">Access your console.</p>
          </div>

          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Google OAuth Button */}
              <GoogleButton href="/api/auth/google" />

              {/* Visual Divider */}
              <div className="relative flex items-center justify-center py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#1e1e1e]"></div>
                </div>
                <span className="relative px-3 text-[11px] text-[#444444] bg-[#111111] uppercase tracking-wider">or</span>
              </div>

              {/* Email */}
              <div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  autoFocus
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="pr-[40px]"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-primary transition-colors flex items-center justify-center h-full focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-[16px] w-[16px]" strokeWidth={2} />
                  ) : (
                    <Eye className="h-[16px] w-[16px]" strokeWidth={2} />
                  )}
                </button>
              </div>

              {/* Error Message */}
              {(errorMsg || error) && (
                <div className="text-[13px] text-[#ffb4ab] bg-[#93000a]/20 border border-[#93000a]/50 p-3 rounded-[6px]">
                  {errorMsg || (typeof error === 'string' ? error : error?.message) || 'Something went wrong'}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full mt-8"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

            </form>

            <div className="mt-6 text-center pt-6 border-t border-[#1e1e1e]">
              <p className="text-[13px] text-[#555555] selection:bg-neutral-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:underline underline-offset-4 decoration-[#333333] transition-colors ">
                  Register
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}