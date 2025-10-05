import React, { useState } from "react";

const TransmissionGenerator = () => {
  const [phase, setPhase] = useState("");
  const [challenge, setChallenge] = useState("");
  const [seasonWord, setSeasonWord] = useState("");
  const [transmission, setTransmission] = useState("");

  const templates = {
    growth: [
      (p) => `
Seeker,

You stand in the fertile soil of growth. Your challenge is ${p.challenge}, yet your word for this season — "${p.seasonWord}" — is the seed that will carry you forward.

Ritual: Write down one action that feels uncomfortable but necessary. Do it before the day ends.
Affirmation: "I grow with patience, and my roots are unshakable."
`,
      (p) => `
Seeker,

Growth is not about speed, but about depth. Though ${p.challenge} feels heavy, your word "${p.seasonWord}" reminds you that roots matter more than branches.

Ritual: Take 10 minutes to breathe slowly and write one thing you are grateful for in your journey.
Affirmation: "I expand steadily, with grace and strength."
`,
    ],
    transition: [
      (p) => `
Seeker,

You are crossing thresholds. The old dissolves, the new has not yet fully formed. Your challenge is ${p.challenge}, and your guiding word is "${p.seasonWord}".

Ritual: Light a candle and speak aloud what you are releasing. Then, whisper what you are calling in.
Affirmation: "I honor the space between endings and beginnings."
`,
      (p) => `
Seeker,

Transitions are sacred pauses. ${p.challenge} may cloud your path, but "${p.seasonWord}" is your lantern.

Ritual: Write down one belief you are ready to let go of, and one you are ready to embrace.
Affirmation: "I trust the unfolding of my path."
`,
    ],
    resilience: [
      (p) => `
Seeker,

You walk the path of resilience. Though ${p.challenge} weighs on you, your word "${p.seasonWord}" is a shield and a compass.

Ritual: Stand tall, breathe deeply, and name three times you overcame what once felt impossible.
Affirmation: "My spirit bends but never breaks."
`,
      (p) => `
Seeker,

Resilience is not about never falling — it is about rising wiser each time. ${p.challenge} cannot define you, for "${p.seasonWord}" is your anchor.

Ritual: Write a short letter to your future self, reminding them of your strength.
Affirmation: "I rise again, stronger than before."
`,
    ],
  };

  const generateTransmission = () => {
    const key = phase.toLowerCase();
    const options = templates[key] || templates.growth;
    const randomIndex = Math.floor(Math.random() * options.length);
    setTransmission(options[randomIndex]({ phase, challenge, seasonWord }));
  };

  return (
    <div className="bg-black text-white p-6 rounded-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-vauntico-gold mb-4">
        Generate Your Transmission
      </h2>

      <div className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Phase (growth/transition/resilience)"
          value={phase}
          onChange={(e) => setPhase(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-800 text-white"
        />
        <input
          type="text"
          placeholder="Your main challenge"
          value={challenge}
          onChange={(e) => setChallenge(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-800 text-white"
        />
        <input
          type="text"
          placeholder="Your word for this season"
          value={seasonWord}
          onChange={(e) => setSeasonWord(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-800 text-white"
        />
        <button
          onClick={generateTransmission}
          className="bg-vauntico-gold text-black px-6 py-2 rounded font-semibold hover:bg-yellow-400 transition"
        >
          Generate
        </button>
      </div>

      {transmission && (
        <div className="bg-gray-900 p-6 rounded-lg whitespace-pre-wrap">
          {transmission}
        </div>
      )}
    </div>
  );
};

export default TransmissionGenerator;