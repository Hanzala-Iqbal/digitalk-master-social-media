import React from 'react';
import './Quicks.css';

export default function Quicks(props) {
  return (
    <div className="pb-3 quicks-container">
      <button
        className="quicks btn btn-outline-secondary text-start"
        data-bs-toggle="collapse"
        href={`#${props.title}`}
        aria-expanded="true"
        aria-controls={props.title}
      >
        <h5>{props.title}</h5>
      </button>
      <div className="collapse show" id={props.title}>
        <ul className="list-unstyled quicks-options">
          {Array.isArray(props.list) ? (
            props.list.map((item, index) => <li className="list-item" style={{color:"white"}} key={index}>{item.username}</li>)
          ) : (
            <li className="list-item">No items found</li>
          )}
        </ul>
      </div>
    </div>
  );
}
