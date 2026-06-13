import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const Protected = ({ children, role }) => {
    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)
    const navigate = useNavigate();

    if (loading) {
        return <div>Loading...</div>
    }

    if (!user) {
        return <Navigate to='/login' />
    }

    if (role && user.role !== role) {
        return (
            <div className="fixed inset-0 z-[100] bg-bento-bg/80 backdrop-blur-sm flex items-center justify-center p-6 font-['Noto_Sans']">
                <div className="bg-bento-card border border-bento-border shadow-bento rounded-[24px] max-w-sm w-full p-8 text-center animate-slide-up-fade relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500/50 to-orange-500/50" />
                    <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                        <ShieldAlert className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-[22px] font-bold text-bento-text tracking-tight mb-2">Access Restricted</h2>
                    <p className="text-[13px] text-bento-text-muted leading-relaxed mb-8">
                        This area is restricted to seller accounts only. Buyers cannot access the merchant dashboard.
                    </p>
                    <button 
                        onClick={() => navigate('/')}
                        className="w-full h-11 bg-bento-text text-bento-bg rounded-[14px] text-[13px] font-bold tracking-wide shadow-bento hover:opacity-90 active:translate-y-[2px] transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Return to Shop
                    </button>
                </div>
            </div>
        )
    }

    return children
}

export default Protected