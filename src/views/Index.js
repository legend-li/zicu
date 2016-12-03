import React from 'react'

import './Index.less';

export default React.createClass({
  render() {
    return (
      <div className='layout'>
        {this.props.children}
      </div>
    )
  }
})