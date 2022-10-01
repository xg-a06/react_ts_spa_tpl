import React from 'react';
const TTT = () => <span>child</span>;

const Wrap = () => <div>{children}</div>;

const Doc = () => {
  return (
    <Wrap>
      <TTT />
      <TTT />
    </Wrap>
  );
};

export default Doc;
