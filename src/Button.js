import React from 'react';

const Button = ({ selectFile }) => {
  return (
    <div className='center'>
      <form>
        <input
          className='btn'
          type="file"
          accept=".pdf"
          onChange={selectFile}
        />
      </form>
    </div>
  );
}

export default Button;
