import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function SkillPower() {
  const [topic, setTopic] = useState('');
  const [display, setDisplay] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runSkillPower = async () => {
    setError('');
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }
    if (attemptsLeft <= 0) {
      setDisplay(
        "<h2 style='color:red;'>System Lock</h2><p>You've used your 3 logic chances.</p>"
      );
      return;
    }

    setDisplay(
      "<h2>🤖 SkillPower AI Initializing...</h2><p>Building Logic Gate for: <strong>" +
        topic +
        '</strong></p>'
    );
    setLoading(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('skillpower', {
        body: { topic },
      });
      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);
      renderOutput(data?.response || '');
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
      setDisplay('<h2>⚠️ Error</h2><p>' + err.message + '</p>');
    } finally {
      setLoading(false);
    }
  };

  const renderOutput = (raw) => {
    const formatted = raw
      .replace(/Title:/gi, '<h1 style="color: #2563eb; margin-top: 20px;">')
      .replace(
        /Hook:/gi,
        '</h1><div style="background: #e0f2fe; padding: 12px; border-left: 4px solid #0284c7; margin: 15px 0;"><strong>🎯 Hook:</strong>'
      )
      .replace(
        /Main Content:/gi,
        '</div><h2 style="color: #1e40af; margin-top: 20px;">📚 Main Content</h2>'
      )
      .replace(/Key Takeaways:/gi, '<h3 style="color: #15803d;">✨ Key Takeaways</h3>')
      .replace(
        /Quiz:/gi,
        '<div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0;"><h3>🧩 Quiz</h3>'
      )
      .replace(/Flashcards:/gi, '</div><h2 style="color: #7c2d12;">🎴 Flashcards</h2>');
    setDisplay(formatted);
  };

  const checkLogic = () => {
    const newAttempts = attemptsLeft - 1;
    setAttemptsLeft(newAttempts);
    alert('✅ Logic Answer Recorded');
    if (newAttempts === 0) alert('⚠️ WARNING: 0 Chances left');
  };

  const resetAttempts = () => {
    setAttemptsLeft(3);
    setDisplay('');
    setTopic('');
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-lg mb-6">
        <h1 className="text-4xl font-bold mb-2">🚀 SkillPower AI</h1>
        <p className="text-lg">Powered by Lovable AI</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <label className="block text-sm font-semibold mb-3 text-gray-800">Enter a topic:</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && runSkillPower()}
            placeholder="e.g., Python Programming..."
            className="flex-1 px-4 py-3 border rounded-lg text-gray-900"
            disabled={loading}
          />
          <button
            onClick={runSkillPower}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-bold"
          >
            {loading ? '⏳ Generating...' : '✨ Generate'}
          </button>
        </div>
        {error && (
          <div className="mt-3 p-3 bg-red-100 text-red-700 rounded">{error}</div>
        )}
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg mb-6 border border-yellow-200">
        <span className="font-bold text-gray-800">
          Attempts: <span className="text-red-600">{attemptsLeft}/3</span>
        </span>
      </div>

      <div
        className="bg-white p-8 rounded-lg shadow-lg min-h-96 mb-6 border border-gray-200 text-gray-900"
        dangerouslySetInnerHTML={{ __html: display }}
      />

      {display && (
        <div className="flex gap-3">
          <button
            onClick={checkLogic}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-bold"
          >
            ✅ Submit Answer
          </button>
          <button
            onClick={resetAttempts}
            className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 font-bold"
          >
            🔄 New Module
          </button>
        </div>
      )}
    </div>
  );
}
