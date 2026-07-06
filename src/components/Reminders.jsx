import React, { useState, useEffect } from 'react';
import { Bell, Heart, BookOpen, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import { devotionals } from '../data/recipes';

export default function Reminders() {
  const [reminders, setReminders] = useState([
    { id: 1, title: 'Hidratação (Água)', time: '09:00', active: true },
    { id: 2, title: 'Leitura Devocional', time: '08:00', active: true },
    { id: 3, title: 'Almoço Saudável', time: '12:30', active: false },
    { id: 4, title: 'Treino e.f.e', time: '18:00', active: true }
  ]);

  const [activeDevotionalIdx, setActiveDevotionalIdx] = useState(0);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const savedReminders = localStorage.getItem('efe_reminders');
    if (savedReminders) setReminders(JSON.parse(savedReminders));
  }, []);

  const toggleReminder = (id) => {
    const updated = reminders.map((r) => r.id === id ? { ...r, active: !r.active } : r);
    setReminders(updated);
    localStorage.setItem('efe_reminders', JSON.stringify(updated));
  };

  const handleAddReminder = (e) => {
    e.preventDefault();
    if (!newTitle || !newTime) return;

    const newReminder = {
      id: Date.now(),
      title: newTitle,
      time: newTime,
      active: true
    };

    const updated = [...reminders, newReminder];
    setReminders(updated);
    localStorage.setItem('efe_reminders', JSON.stringify(updated));

    setNewTitle('');
    setNewTime('');
    
    // Solicitar Permissão de Notificação
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  const handleDeleteReminder = (id) => {
    const updated = reminders.filter((r) => r.id !== id);
    setReminders(updated);
    localStorage.setItem('efe_reminders', JSON.stringify(updated));
  };

  const triggerTestNotification = () => {
    if (!('Notification' in window)) {
      setStatusMessage('Notificações não são suportadas neste navegador.');
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification('Centro de Saúde e.f.e', {
        body: 'Hora de beber um copo de água e respirar fundo! 💧',
        icon: '/src/assets/logo.svg'
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification('Centro de Saúde e.f.e', {
            body: 'Notificações ativadas com sucesso!',
            icon: '/src/assets/logo.svg'
          });
        }
      });
    } else {
      setStatusMessage('Permissão de notificação negada. Ative-as nas configurações do navegador.');
      setTimeout(() => setStatusMessage(''), 4000);
    }
  };

  const currentDevotional = devotionals[activeDevotionalIdx];

  return (
    <div className="fade-in grid-2">
      {/* Devocional do Dia */}
      <div className="card glass" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 className="card-title">
          <BookOpen size={20} style={{ color: 'var(--primary)' }} />
          Devocional de Cuidado Integral
        </h3>

        {currentDevotional && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '16px', background: 'rgba(139,92,246,0.05)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--primary)' }}>
              <h4 style={{ fontStyle: 'italic', fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                "{currentDevotional.verse}"
              </h4>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                {currentDevotional.reference}
              </span>
            </div>

            <div>
              <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                {currentDevotional.title}
              </strong>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {currentDevotional.reflection}
              </p>
            </div>

            <div style={{ padding: '12px 16px', background: 'var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Oração do Dia
              </span>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                {currentDevotional.prayer}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              {devotionals.map((d, idx) => (
                <button
                  key={d.id}
                  onClick={() => setActiveDevotionalIdx(idx)}
                  className={`tab-btn`}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    background: activeDevotionalIdx === idx ? 'var(--primary)' : 'transparent',
                    color: activeDevotionalIdx === idx ? 'white' : 'var(--text-secondary)'
                  }}
                >
                  Leitura {idx + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lembretes e Notificações */}
      <div className="card glass" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 className="card-title">
          <Bell size={20} style={{ color: 'var(--accent-orange)' }} />
          Lembretes e Alertas
        </h3>

        {statusMessage && (
          <div style={{ padding: '10px 16px', background: 'var(--danger-light)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            {statusMessage}
          </div>
        )}

        <form onSubmit={handleAddReminder} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', background: 'var(--bg-card)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div className="input-group" style={{ flex: 2, marginBottom: 0 }}>
            <label>Título do Lembrete</label>
            <input
              type="text"
              placeholder="Ex: Treino da tarde"
              className="form-control"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
          </div>
          <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
            <label>Horário</label>
            <input
              type="time"
              className="form-control"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '12px 16px' }}>Adicionar</button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {reminders.map((reminder) => (
            <div key={reminder.id} className="flex-between" style={{ padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <strong style={{ fontSize: '0.9rem', color: reminder.active ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {reminder.title}
                </strong>
                <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Diariamente às {reminder.time}
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => toggleReminder(reminder.id)}
                  className={`btn btn-sm ${reminder.active ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                >
                  {reminder.active ? 'Ativo' : 'Pausado'}
                </button>
                <button 
                  onClick={() => handleDeleteReminder(reminder.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>

        <button onClick={triggerTestNotification} className="btn btn-secondary" style={{ width: '100%' }}>
          Enviar Notificação de Teste
        </button>
      </div>
    </div>
  );
}
