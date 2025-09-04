import React, { useContext, useState } from 'react';
import SkillContext from '../contexts/SkillContext';
import './RecordPracticeForm.css';

const RecordPracticeForm = () => {
  const { skills, recordPractice } = useContext(SkillContext);
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [practiceHours, setPracticeHours] = useState(1);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedSkillId) {
      setError('请选择技能');
      return;
    }

    if (practiceHours <= 0) {
      setError('练习小时数必须大于0');
      return;
    }

    recordPractice(Number(selectedSkillId), practiceHours);
    setSelectedSkillId('');
    setPracticeHours(1);
    setError('');
  };

  if (skills.length === 0) {
    return (
      <div className="record-practice-form empty">
        <p>暂无技能，请先添加技能</p>
      </div>
    );
  }

  return (
    <div className="record-practice-form">
      <h2>记录练习时间</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="skillSelect">选择技能</label>
          <select
            id="skillSelect"
            value={selectedSkillId}
            onChange={(e) => setSelectedSkillId(e.target.value)}
          >
            <option value="">-- 请选择 --</option>
            {skills.map(skill => (
              <option key={skill.id} value={skill.id}>
                {skill.name} (当前: {skill.hoursPracticed.toFixed(1)} 小时)
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="practiceHours">练习小时数</label>
          <input
            type="number"
            id="practiceHours"
            value={practiceHours}
            onChange={(e) => setPracticeHours(Number(e.target.value))}
            min="0.1"
            step="0.1"
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="btn-primary">记录</button>
      </form>
    </div>
  );
};

export default RecordPracticeForm;