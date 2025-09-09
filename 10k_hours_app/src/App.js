import React from 'react';
import './App.css';
import { SkillProvider } from './contexts/SkillContext';
import { ThemeProvider } from './contexts/ThemeContext';
import SkillProgress from './components/SkillProgress';
import SkillList from './components/SkillList';
import AddSkillForm from './components/AddSkillForm';
import RecordPracticeForm from './components/RecordPracticeForm';
import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <ThemeProvider>
      <SkillProvider>
        <div className="app-container" style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1>刻意练习</h1>
            <ThemeToggle />
          </div>
          <AddSkillForm />
          <RecordPracticeForm />
          <SkillList />
          <SkillProgress />
        </div>
      </SkillProvider>
    </ThemeProvider>
  );
}

export default App;
