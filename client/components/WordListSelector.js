import React from 'react';

function WordListSelector({ selectedList, onChange, wordLists }) {
  return (
    <div className="wordlist-options">
      {wordLists.map((list) => (
        <button
          key={list}
          className={`wordlist-btn ${selectedList === list ? 'active' : ''}`}
          onClick={() => onChange(list)}
        >
          {list}
        </button>
      ))}
    </div>
  );
}

export default WordListSelector;
