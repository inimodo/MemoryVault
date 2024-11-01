import React from 'react';
import UserSelect from './content/userselect.js';

class MemoryVault extends React.Component{

  constructor(props)
  {
    super(props);
    const params = new URLSearchParams(window.location.search);
    this.state =
    {
      token: params.get("token"),
      user:-1
    };

    this.selectUser = this.selectUser.bind(this);
  }

  selectUser(selUser)
  {
    this.setState({user:selUser});
  }
  
  render(){
    return (
        <UserSelect selectUser={this.selectUser}/>
    );
  }
}

export default MemoryVault;
