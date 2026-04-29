import { useState } from 'react';
import { useRouter } from 'react-router-dom';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-900 via-brand-800 to-slate-900 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Welcome to ResiPilot</h1>
          <p className="text-gray-500 mt-1">Step {step} of 3</p>
        </div>
        <div className="h-2 bg-gray-100 rounded-full mb-8">
          <div className="h-full bg-brand-600 rounded-full transition-all" style={{ width: `${(step / 3) * 100}%` }} />
        </div>
        {step === 1 && (
          <div className="text-center space-y-4">
            <h2 className="text-lg font-semibold">Set up your organization</h2>
            <input className="w-full px-4 py-3 border rounded-lg" placeholder="Organization name" />
            <button onClick={() => setStep(2)} className="w-full py-3 bg-brand-600 text-white rounded-lg">Continue</button>
          </div>
        )}
        {step === 2 && (
          <div className="text-center space-y-4">
            <h2 className="text-lg font-semibold">Invite team members</h2>
            <input className="w-full px-4 py-3 border rounded-lg" placeholder="Email addresses" />
            <button onClick={() => setStep(3)} className="w-full py-3 bg-brand-600 text-white rounded-lg">Continue</button>
          </div>
        )}
        {step === 3 && (
          <div className="text-center space-y-4">
            <h2 className="text-lg font-semibold">You're all set!</h2>
            <p className="text-gray-500">Start managing your cases with ResiPilot.</p>
            <button onClick={() => navigate('/dashboard')} className="w-full py-3 bg-brand-600 text-white rounded-lg">Go to Dashboard</button>
          </div>
        )}
      </div>
    </div>
  );
}
