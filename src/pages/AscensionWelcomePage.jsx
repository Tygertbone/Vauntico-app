import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Sparkles, Mail, Calendar, Book, Crown } from 'lucide-react';

const AscensionWelcomePage = () => {
  const [soulProfile, setSoulProfile] = useState(null);
  const [firstTransmission, setFirstTransmission] = useState('');

  useEffect(() => {
    // Load soul profile from localStorage
    const profile = JSON.parse(localStorage.getItem('soul_profile') || '{}');
    setSoulProfile(profile);

    // Generate first transmission based on profile
    generateFirstTransmission(profile);
  }, []);

  const generateFirstTransmission = (profile) => {
    const transmission = `Seeker,

You are reading this because some part of you knows: the old way of building is breaking.

Your word for this season is "${profile.seasonWord || 'transformation'}". Hold it close. Let it guide you.

You've identified your current phase as ${profile.phase || 'growth'}. This is not random. You are exactly where you need to be.

TODAY'S TEACHING:
Every empire begins with a single ritual. Not a business plan. Not a strategy deck. A ritual. A small, repeated action that signals to the universe: I am ready.

Your ritual today: Before you check another email, before you open another tab, place your hand on your chest and ask: "What am I building, and who am I becoming through it?"

Wait for the answer. It will come.

AFFIRMATION:
I build cathedrals, not shacks. My work is worship.

Tomorrow, we go deeper.

— Vauntico`;

    setFirstTransmission(transmission);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white px-4 py-12">
      <Helmet>
        <title>Welcome — Vauntico Ascension</title>
        <meta name="description" content="Your ascension begins now. Access transmissions, rituals, and your active subscription details." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <main role="main" className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="text-4xl font-bold text-[var(--vauntico-gold-text)] mb-6">VAUNTICO</div>
          
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 bg-opacity-20 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-[var(--vauntico-gold-text)] bg-clip-text text-transparent">
            Your Ascension Begins Now ✨
          </h1>
          
          <p className="text-xl text-gray-300 mb-4">
            Welcome to the inner circle of visionaries who dare to dream bigger.
          </p>
          
          <Badge className="bg-[var(--vauntico-gold)] text-black px-4 py-2 text-sm font-semibold">
            <Crown className="w-4 h-4 inline mr-2" />
            Active Subscription
          </Badge>
        </div>

        {/* What Happens Next */}
        <Card className="bg-gray-900 border-[var(--vauntico-gold)] border-2 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[var(--vauntico-gold-text)]" />
              What Happens Next
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Your First Transmission Arrives Tomorrow</h3>
                <p className="text-gray-400 text-sm">
                  Check your inbox at {soulProfile?.timeOfDay || 'your chosen time'} for your personalized daily wisdom.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-yellow-500 bg-opacity-20 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-yellow-400" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Weekly Rituals Begin This Week</h3>
                <p className="text-gray-400 text-sm">
                  You'll receive your first moon phase ritual on the next lunar event.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-[var(--vauntico-gold)] bg-opacity-20 rounded-full flex items-center justify-center">
                  <Book className="w-5 h-5 text-[var(--vauntico-gold-text)]" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Access Your Archive Anytime</h3>
                <p className="text-gray-400 text-sm">
                  All past transmissions are saved in your personal vault at vauntico.com/archive
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview Transmission */}
        <Card className="bg-gradient-to-br from-purple-900 to-gray-900 border-purple-500 border-2 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              Your First Transmission (Preview)
            </CardTitle>
            <p className="text-gray-400 text-sm">
              Here's a taste of what's coming tomorrow...
            </p>
          </CardHeader>
          <CardContent>
            <div className="bg-black bg-opacity-50 p-6 rounded-lg">
              <pre className="text-gray-300 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {firstTransmission}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card className="bg-yellow-900 bg-opacity-30 border-yellow-600 border-2 mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              📌 Important: Save This Page
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-200">
            <p>
              • <strong>Bookmark this URL</strong> for quick access to your account settings
            </p>
            <p>
              • <strong>Whitelist our email</strong> (transmissions@vauntico.com) to ensure delivery
            </p>
            <p>
              • <strong>Check spam folder</strong> if you don't see your first transmission tomorrow
            </p>
            <p>
              • <strong>Manage subscription</strong> anytime at vauntico.com/account
            </p>
          </CardContent>
        </Card>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-[var(--vauntico-gold)] to-[var(--vauntico-gold-hover)] text-black font-semibold px-8 py-6 text-lg rounded-lg hover:scale-105 transition-transform"
          >
            Return to Dashboard
          </Button>
          <Button
            onClick={() => window.open('https://discord.gg/vauntico', '_blank')}
            className="border-2 border-purple-500 bg-transparent text-purple-300 hover:bg-purple-500 hover:text-white px-8 py-6 text-lg rounded-lg transition-colors"
          >
            Join Community
          </Button>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-12 space-y-4">
          <p className="text-gray-400">
            Questions? We're here to help.
          </p>
          <p className="text-sm text-gray-500">
            Email: support@vauntico.com | Response time: Within 24 hours
          </p>
        </div>
      </main>
      <footer role="contentinfo" className="text-center text-xs text-gray-500 mt-12">© Vauntico — Ascension Active</footer>
    </div>
  );
};

export default AscensionWelcomePage;