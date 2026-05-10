import React, { useState, useEffect } from 'react';
import { submitAssessment, getAssessmentHistory } from '../api';

const ASSESSMENTS = {
  phq9: {
    name: 'PHQ-9 Depression Screening', icon: '🧠',
    desc: 'Over the last 2 weeks, how often have you been bothered by the following?',
    options: ['Not at all (0)', 'Several days (1)', 'More than half the days (2)', 'Nearly every day (3)'],
    questions: [
      'Little interest or pleasure in doing things',
      'Feeling down, depressed, or hopeless',
      'Trouble falling or staying asleep, or sleeping too much',
      'Feeling tired or having little energy',
      'Poor appetite or overeating',
      'Feeling bad about yourself — or that you are a failure',
      'Trouble concentrating on things',
      'Moving or speaking so slowly that other people noticed',
      'Thoughts that you would be better off dead or of hurting yourself',
    ],
  },
  gad7: {
    name: 'GAD-7 Anxiety Screening', icon: '💭',
    desc: 'Over the last 2 weeks, how often have you been bothered by the following?',
    options: ['Not at all (0)', 'Several days (1)', 'More than half the days (2)', 'Nearly every day (3)'],
    questions: [
      'Feeling nervous, anxious, or on edge',
      'Not being able to stop or control worrying',
      'Worrying too much about different things',
      'Trouble relaxing',
      'Being so restless that it is hard to sit still',
      'Becoming easily annoyed or irritable',
      'Feeling afraid, as if something awful might happen',
    ],
  },
  stress: {
    name: 'Perceived Stress Scale', icon: '⚡',
    desc: 'In the last month, how often have you felt the following?',
    options: ['Never (0)', 'Almost never (1)', 'Sometimes (2)', 'Fairly often (3)'],
    questions: [
      'Upset because of something that happened unexpectedly',
      'Unable to control important things in your life',
      'Nervous and stressed',
      'Unable to cope with all the things you had to do',
      'Difficulties were piling up so high you could not overcome them',
      'Felt difficulties were piling up and you couldn\'t overcome them',
      'Irritable due to circumstances outside your control',
    ],
  },
};

const RISK_COLORS = { low: '#4a8c7a', moderate: '#c97d4a', high: '#e55' };
const RISK_BG = { low: '#f0faf5', moderate: '#fdf0e6', high: '#fff5f5' };

export default function Assessment() {
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => { getAssessmentHistory().then(r => setHistory(r.data || [])).catch(() => {}); }, []);

  const start = (type) => { setSelected(type); setAnswers(new Array(ASSESSMENTS[type].questions.length).fill(null)); setResult(null); };
  const reset = () => { setSelected(null); setResult(null); setAnswers([]); };

  const submit = async () => {
    if (answers.some(a => a === null)) return alert('Please answer all questions.');
    setLoading(true);
    try {
      const res = await submitAssessment({ assessment_type: selected, responses: answers });
      setResult(res.data);
      getAssessmentHistory().then(r => setHistory(r.data || [])).catch(() => {});
    } catch {} finally { setLoading(false); }
  };

  const asmtData = selected ? ASSESSMENTS[selected] : null;
  const answered = answers.filter(a => a !== null).length;
  const total = asmtData?.questions.length || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-xl)', maxWidth: 860 }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28 }}>Self-Assessment</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Standardised mental health screenings to understand your current wellbeing.</p>
      </div>

      {/* Pick type */}
      {!selected && !result && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--gap-lg)' }}>
            {Object.entries(ASSESSMENTS).map(([key, a]) => (
              <div key={key} className="card card-hover" style={{ padding: 'var(--gap-lg)', display: 'flex', flexDirection: 'column', gap: 10 }}
                onClick={() => start(key)}>
                <div style={{ fontSize: 36 }}>{a.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{a.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.questions.length} questions · ~3 mins</div>
                <button className="btn btn-primary" style={{ marginTop: 'auto', width: '100%', fontSize: 13, padding: 9 }}>Start →</button>
              </div>
            ))}
          </div>

          {history.length > 0 && (
            <div className="card" style={{ padding: 'var(--gap-lg)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 16 }}>Assessment History</h2>
              {history.map(h => (
                <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 0', borderBottom: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 20 }}>{ASSESSMENTS[h.assessment_type]?.icon}</span>
                  <span style={{ flex: 1, fontWeight: 500, fontSize: 13 }}>{ASSESSMENTS[h.assessment_type]?.name}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(h.taken_at).toLocaleDateString()}</span>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>Score: {h.score}</span>
                  <span style={{ padding: '3px 12px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: RISK_BG[h.risk_level], color: RISK_COLORS[h.risk_level] }}>
                    {h.risk_level} risk
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Quiz */}
      {selected && !result && asmtData && (
        <div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20 }}>
            <button className="btn btn-outline" style={{ fontSize: 13, padding: '8px 16px' }} onClick={reset}>← Back</button>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{asmtData.icon} {asmtData.name}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{asmtData.desc}</div>
            </div>
          </div>

          {/* Progress */}
          <div style={{ height: 6, background: 'var(--border-subtle)', borderRadius: 99, marginBottom: 6, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(answered/total)*100}%`, background: 'linear-gradient(90deg, var(--sage), var(--sage-light))', borderRadius: 99, transition: 'width 0.3s' }} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>{answered}/{total} answered</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {asmtData.questions.map((q, i) => (
              <div key={i} className="card" style={{ padding: 'var(--gap-lg)', border: answers[i] !== null ? '1.5px solid var(--sage)' : '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: 500, marginBottom: 14, lineHeight: 1.5, fontSize: 14 }}>
                  <span style={{ color: 'var(--sage)', fontWeight: 700, marginRight: 6 }}>{i+1}.</span>{q}
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {asmtData.options.map((opt, vi) => (
                    <label key={vi} style={{
                      padding: '7px 14px', borderRadius: 99, fontSize: 12.5, cursor: 'pointer',
                      border: `1.5px solid ${answers[i]===vi ? 'var(--sage)' : 'var(--border-light)'}`,
                      background: answers[i]===vi ? 'var(--sage-ghost)' : 'white',
                      color: answers[i]===vi ? 'var(--forest-light)' : 'var(--text-secondary)',
                      fontWeight: answers[i]===vi ? 600 : 400, transition: 'all 0.15s',
                    }}>
                      <input type="radio" name={`q${i}`} value={vi} checked={answers[i]===vi}
                        onChange={() => { const n=[...answers]; n[i]=vi; setAnswers(n); }}
                        style={{ display: 'none' }} />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button className="btn btn-primary" style={{ marginTop: 24, padding: '14px 40px', fontSize: 15 }}
            onClick={submit} disabled={loading || answered < total}>
            {loading ? 'Analysing…' : answered < total ? `Answer all ${total} questions` : 'See My Results →'}
          </button>
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="card" style={{ maxWidth: 560, width: '100%', textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>
              {result.risk_level==='low' ? '🟢' : result.risk_level==='moderate' ? '🟡' : '🔴'}
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 16 }}>{result.message}</h2>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 28 }}>
              <span style={{ padding: '6px 18px', borderRadius: 99, fontSize: 13, fontWeight: 700, background: RISK_BG[result.risk_level], color: RISK_COLORS[result.risk_level] }}>
                {result.risk_level.toUpperCase()} RISK
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Score: {result.score}</span>
            </div>
            <div style={{ textAlign: 'left', marginBottom: 24 }}>
              <h3 style={{ fontSize: 15, marginBottom: 12, color: 'var(--text-primary)' }}>Recommendations</h3>
              {result.recommendations.map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 13, color: 'var(--text-secondary)', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--sage)', fontWeight: 700, flexShrink: 0 }}>→</span> {r}
                </div>
              ))}
            </div>
            {result.risk_level === 'high' && (
              <div style={{ background: '#fff5f5', border: '1px solid #ffd4d4', borderRadius: 'var(--r-md)', padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#c33' }}>
                🆘 Please reach out for professional support immediately.
              </div>
            )}
            <button className="btn btn-primary" onClick={reset}>Take Another Assessment</button>
          </div>
        </div>
      )}

      <div style={{ padding: '14px 20px', background: 'var(--warm-pale)', border: '1px solid #f0d0a0', borderRadius: 'var(--r-md)', fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
        ⚠️ These assessments are screening tools only and do not constitute a clinical diagnosis. Always consult a licensed mental health professional.
      </div>
    </div>
  );
}
