import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Moon, Sunrise, Sunset, Sun } from 'lucide-react';

const AscensionOnboardingPage = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [soulProfile, setSoulProfile] = useState({
    phase: '',
    timeOfDay: '',
    challenge: '',
    seasonWord: '',
    intention: ''
  });

  const phases = [
    { value: 'growth', label: 'Growth', description: 'Expanding, learning, building momentum' },
    { value: 'healing', label: 'Healing', description: 'Processing, releasing, integrating' },
    { value: 'building', label: 'Building', description: 'Creating, launching, manifesting' },
    { value: 'expanding', label: 'Expanding', description: 'Scaling, reaching, becoming' }
  ];

  const timesOfDay = [
    { value: 'morning', label: 'Morning', icon: <Sunrise className="w-5 h-5" /> },
    { value: 'midday', label: 'Midday', icon: <Sun className="w-5 h-5" /> },
    { value: 'evening', label: 'Evening', icon: <Sunset className="w-5 h-5" /> },
    { value: 'night', label: 'Night', icon: <Moon className="w-5 h-5" /> }
  ];

  const challenges = [
    { value: 'clarity', label: 'Finding Clarity', description: 'I need direction and focus' },
    { value: 'momentum', label: 'Building Momentum', description: 'I struggle with consistency' },
    { value: 'confidence', label: 'Growing Confidence', description: 'I doubt my abilities' },
    { value: 'balance', label: 'Creating Balance', description: 'I feel overwhelmed' }
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const email = localStorage.getItem('ascension_email');
      const plan = localStorage.getItem('ascension_plan');

      // Save profile to localStorage
      localStorage.setItem('soul_profile', JSON.stringify(soulProfile));

      // In production, you would POST to your API here
      console.log('Soul profile submitted:', { email, plan, soulProfile });

      // Redirect to welcome page
      setTimeout(() => {
        window.location.href = '/ascension-welcome';
      }, 1500);
    } catch (error) {
      console.error('Profile submission error:', error);
      localStorage.setItem('soul_profile', JSON.stringify(soulProfile));
      window.location.href = '/ascension-welcome';
    }
  };

  const handleNext = () => {
    if (step === 1 && !soulProfile.phase) {
      alert('Please select your current phase');
      return;
    }
    if (step === 2 && !soulProfile.timeOfDay) {
      alert('Please select your preferred time');
      return;
    }
    if (step === 3 && !soulProfile.challenge) {
      alert('Please select your main challenge');
      return;
    }
    setStep(step + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white px-4 py-12">
      <Helmet>
        <title>Onboarding — Vauntico Ascension</title>
        <meta name="description" content="Create your soul profile to personalize transmissions. Your ascension begins here." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <main role="main" className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-4xl font-bold text-[var(--vauntico-gold-text)] mb-6">VAUNTICO</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-[var(--vauntico-gold-text)] bg-clip-text text-transparent">
            Create Your Soul Profile
          </h1>
          <p className="text-gray-400">
            Help us craft transmissions that resonate with your journey
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">Step {step} of 4</span>
            <span className="text-sm text-gray-400">{Math.round((step / 4) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-[var(--vauntico-gold)] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Phase */}
        {step === 1 && (
          <Card className="bg-gray-900 border-purple-500 border-2">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-400" />
                What phase of transformation are you in?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={soulProfile.phase}
                onValueChange={(value) => setSoulProfile({ ...soulProfile, phase: value })}
                className="space-y-4"
              >
                {phases.map((phase) => (
                  <div key={phase.value} className="flex items-center space-x-3 p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors">
                    <RadioGroupItem value={phase.value} id={phase.value} />
                    <Label htmlFor={phase.value} className="flex-1 cursor-pointer">
                      <div className="font-semibold text-white">{phase.label}</div>
                      <div className="text-sm text-gray-400">{phase.description}</div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              <Button onClick={handleNext} className="w-full mt-6 bg-gradient-to-r from-[var(--vauntico-gold)] to-[var(--vauntico-gold-hover)] text-black font-semibold rounded-lg hover:scale-105 transition-transform">
                Continue →
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Time of Day */}
        {step === 2 && (
          <Card className="bg-gray-900 border-purple-500 border-2">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Moon className="w-6 h-6 text-purple-400" />
                When do you feel most aligned?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={soulProfile.timeOfDay}
                onValueChange={(value) => setSoulProfile({ ...soulProfile, timeOfDay: value })}
                className="grid grid-cols-2 gap-4"
              >
                {timesOfDay.map((time) => (
                  <div key={time.value} className="flex items-center space-x-3 p-6 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors">
                    <RadioGroupItem value={time.value} id={time.value} />
                    <Label htmlFor={time.value} className="flex-1 cursor-pointer flex items-center gap-2">
                      {time.icon}
                      <span className="font-semibold text-white">{time.label}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              <div className="flex gap-3 mt-6">
                <Button onClick={() => setStep(1)} className="flex-1 border-2 border-gray-600 bg-transparent text-white hover:bg-gray-800 rounded-lg">
                  ← Back
                </Button>
                <Button onClick={handleNext} className="flex-1 bg-gradient-to-r from-[var(--vauntico-gold)] to-[var(--vauntico-gold-hover)] text-black font-semibold rounded-lg hover:scale-105 transition-transform">
                  Continue →
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Challenge */}
        {step === 3 && (
          <Card className="bg-gray-900 border-purple-500 border-2">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-400" />
                Your current challenge is...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={soulProfile.challenge}
                onValueChange={(value) => setSoulProfile({ ...soulProfile, challenge: value })}
                className="space-y-4"
              >
                {challenges.map((challenge) => (
                  <div key={challenge.value} className="flex items-center space-x-3 p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors">
                    <RadioGroupItem value={challenge.value} id={challenge.value} />
                    <Label htmlFor={challenge.value} className="flex-1 cursor-pointer">
                      <div className="font-semibold text-white">{challenge.label}</div>
                      <div className="text-sm text-gray-400">{challenge.description}</div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              <div className="flex gap-3 mt-6">
                <Button onClick={() => setStep(2)} className="flex-1 border-2 border-gray-600 bg-transparent text-white hover:bg-gray-800 rounded-lg">
                  ← Back
                </Button>
                <Button onClick={handleNext} className="flex-1 bg-gradient-to-r from-[var(--vauntico-gold)] to-[var(--vauntico-gold-hover)] text-black font-semibold rounded-lg hover:scale-105 transition-transform">
                  Continue →
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Personal Touch */}
        {step === 4 && (
          <Card className="bg-gray-900 border-purple-500 border-2">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-400" />
                Final touches...
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="seasonWord" className="text-white mb-2 block">
                  Your word for this season:
                </Label>
                <input
                  id="seasonWord"
                  type="text"
                  placeholder="e.g., Awakening, Momentum, Clarity, Freedom..."
                  value={soulProfile.seasonWord}
                  onChange={(e) => setSoulProfile({ ...soulProfile, seasonWord: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <Label htmlFor="intention" className="text-white mb-2 block">
                  What do you hope to create or become? (Optional)
                </Label>
                <Textarea
                  id="intention"
                  placeholder="Share your vision..."
                  value={soulProfile.intention}
                  onChange={(e) => setSoulProfile({ ...soulProfile, intention: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <Button onClick={() => setStep(3)} className="flex-1 border-2 border-gray-600 bg-transparent text-white hover:bg-gray-800 rounded-lg">
                  ← Back
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting || !soulProfile.seasonWord}
                  className="flex-1 bg-gradient-to-r from-[var(--vauntico-gold)] to-[var(--vauntico-gold-hover)] text-black font-semibold rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating Your Journey...' : 'Complete Profile ✨'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
      <footer role="contentinfo" className="text-center text-xs text-gray-500 mt-12">© Vauntico — Transmission Sealed</footer>
    </div>
  );
};

export default AscensionOnboardingPage;