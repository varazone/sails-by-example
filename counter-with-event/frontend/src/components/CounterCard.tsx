import React, { useState } from 'react';

interface CounterCardProps {
  initialCount?: number;
  title: string;
}

const CounterCard: React.FC<CounterCardProps> = ({ initialCount = 0, title }) => {
  const [count, setCount] = useState<number>(initialCount);

  const incrementCount = () => {
    setCount((prevCount) => prevCount + 1);
  };

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>You clicked {count} times</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary" onClick={incrementCount}>
            Click me
          </button>
        </div>
      </div>
    </div>
  );
};

export default CounterCard;
