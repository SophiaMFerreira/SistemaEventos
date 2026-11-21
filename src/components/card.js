import React from 'react';

class Card extends React.Component {
  render() {
    return (
      <div className='card md-3'>
        <h5 className='card-header' style={{ fontWeight: 600, fontSize: '1.1rem' }}>{this.props.title}</h5>
        <div className='card-body'>{this.props.children}</div>
      </div>
    );
  }
}

export default Card;
