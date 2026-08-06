import React, { useState } from 'react';
import { Sparkles, Send, BrainCircuit, BookCheck } from 'lucide-react';

export default function SelfStudyPage() {
  const [question, setQuestion] = useState('');
  const [subject, setSubject] = useState('수학');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: '안녕하세요! SelfStudy AI 학습 케어 튜터입니다. 공부 중 막히는 개념이나 질문이 있다면 무엇이든 물어보세요!'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleAskAI = async () => {
    if (!question.trim()) return;

    const userMsg = { sender: 'user', text: question, subject };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion('');
    setLoading(true);

    try {
      const res = await fetch('/api/selfstudy/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 1, question: question, context_subject: subject })
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: 'ai', text: data.answer }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'ai', text: '오류가 발생하여 답변을 생성하지 못했습니다.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles color="#c084fc" /> SelfStudy AI 밀착 학습 케어 센터
        </h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
          [사이드 부가 모듈] Gemini AI RAG 기반 실시간 학습 질의응답 및 몰입도 분석이 제공됩니다.
        </p>
      </div>

      <div className="grid-2">
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '520px' }}>
          <h3>AI 튜터 대화창</h3>
          <div style={{ flex: 1, overflowY: 'auto', margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  background: m.sender === 'user' ? 'var(--accent-blue)' : 'var(--bg-card)',
                  padding: '0.8rem 1rem',
                  borderRadius: '12px',
                  maxWidth: '85%',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.5'
                }}
              >
                {m.sender === 'ai' && <BrainCircuit size={16} color="#c084fc" style={{ marginRight: '6px', verticalAlign: 'middle' }} />}
                {m.text}
              </div>
            ))}
            {loading && <div style={{ color: 'var(--text-muted)' }}>AI 튜터가 답변을 작성하고 있습니다...</div>}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="input-field"
              style={{ width: '110px', marginBottom: 0 }}
            >
              <option value="수학">수학</option>
              <option value="영어">영어</option>
              <option value="국어">국어</option>
              <option value="탐구">탐구/기타</option>
            </select>
            <input
              className="input-field"
              style={{ marginBottom: 0, flex: 1 }}
              placeholder="질문 내용을 입력하세요..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
            />
            <button onClick={handleAskAI} className="btn-primary">
              <Send size={18} />
            </button>
          </div>
        </div>

        <div className="glass-card">
          <h3>오늘의 학습 몰입도 & 리포트</h3>
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>오늘 총 학습 시간</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#34d399' }}>4시간 25분</div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>AI 측정 몰입도 점수</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#60a5fa' }}>94.5 / 100점</div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>주요 학습 과목</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#c084fc', marginTop: '4px' }}>
                <BookCheck size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                수학 (미적분학), 영어 독해
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
