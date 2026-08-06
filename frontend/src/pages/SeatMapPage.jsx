import React, { useState, useEffect } from 'react';
import { DoorOpen, CheckCircle, UserCheck } from 'lucide-react';

export default function SeatMapPage() {
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [userName, setUserName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSeats();
  }, []);

  const fetchSeats = async () => {
    try {
      const res = await fetch('/api/seats/');
      const data = await res.json();
      setSeats(data);
    } catch (err) {
      console.error("Failed to fetch seats:", err);
    }
  };

  const handleAssignSeat = async () => {
    if (!userName || !phone || !selectedSeat) {
      setMessage("이름, 전화번호 및 좌석을 선택해주세요.");
      return;
    }
    try {
      // 1. Register user
      const userRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userName, phone: phone })
      });
      const userData = await userRes.json();

      // 2. Assign seat
      const assignRes = await fetch('/api/seats/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userData.id, seat_number: selectedSeat.seat_number })
      });

      if (assignRes.ok) {
        setMessage(`[성공] ${selectedSeat.seat_number} 좌석 배정이 완료되었습니다!`);
        fetchSeats();
        setSelectedSeat(null);
      } else {
        const errData = await assignRes.json();
        setMessage(`[오류] ${errData.detail}`);
      }
    } catch (err) {
      setMessage("좌석 배정 중 오류가 발생했습니다.");
    }
  };

  const handleTriggerDoor = async () => {
    try {
      const res = await fetch('/api/door/trigger/1', { method: 'POST' });
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      setMessage("도어 개폐 요청 실패");
    }
  };

  return (
    <div>
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>실시간 좌석 현황판</h2>
          <p style={{ color: 'var(--text-muted)' }}>원하시는 좌석을 클릭하여 입실 및 배정을 진행하세요.</p>
        </div>
        <button onClick={handleTriggerDoor} className="btn-primary" style={{ background: 'var(--accent-emerald)' }}>
          <DoorOpen size={18} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          출입문 개폐 (IoT NFC)
        </button>
      </div>

      {message && (
        <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-blue)', color: '#60a5fa' }}>
          {message}
        </div>
      )}

      <div className="grid-2">
        <div className="glass-card">
          <h3 style={{ marginBottom: '1rem' }}>좌석배치도</h3>
          <div className="grid-seat">
            {seats.map((seat) => {
              const isOccupied = seat.status === 'OCCUPIED';
              const isManaged = seat.zone_type === 'MANAGED';
              return (
                <div
                  key={seat.id}
                  className={`seat-box ${isOccupied ? 'occupied' : ''} ${isManaged ? 'managed' : ''}`}
                  onClick={() => setSelectedSeat(seat)}
                  style={{
                    boxShadow: selectedSeat?.id === seat.id ? '0 0 0 3px var(--accent-blue)' : 'none'
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{seat.seat_number}</div>
                  <div style={{ fontSize: '0.75rem', marginTop: '4px', color: 'var(--text-muted)' }}>
                    {isOccupied ? '사용중' : (isManaged ? '관리형존' : '일반존')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card">
          <h3>좌석 입실 & 배정하기</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            선택된 좌석: <strong style={{ color: 'var(--accent-blue)' }}>{selectedSeat ? selectedSeat.seat_number : '선택 안됨'}</strong>
          </p>

          <label style={{ display: 'block', marginBottom: '0.4rem' }}>이름</label>
          <input
            className="input-field"
            placeholder="홍길동"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />

          <label style={{ display: 'block', marginBottom: '0.4rem' }}>전화번호</label>
          <input
            className="input-field"
            placeholder="01012345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button onClick={handleAssignSeat} className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            <UserCheck size={18} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            입실 / 좌석 배정 완료
          </button>
        </div>
      </div>
    </div>
  );
}
