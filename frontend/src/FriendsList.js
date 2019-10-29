import React from 'react';


const userStyles = {
  display:'inline-block'
};

const allUsers = ["Jarosław", "Piotr", "Wojciech", "Mateusz"];


function FriendListComponent() {
  return (
    <div className="FriendListComponent">
      <FriendsComponent allUsersList={allUsers}/>
    </div>
  )
}


class FriendsComponent extends React.Component {
  constructor({allUsersList}) {
    super();
    this.state = {
      filteredUsers: allUsersList
    }

    this.filter = this.filter.bind(this);
  }

  render() {
    return (
      <div>
        <input 
          className="findUsersInput"
          onChange={this.filter}>
        </input>
        <UsersList users={this.state.filteredUsers} />
      </div>
    )
  }

  filter(e) {
    const text = e.currentTarget.value;
    const newUsers = this.getFilteredUsers(text);
    this.setState({
      filteredUsers: newUsers
    });
  }

  getFilteredUsers(text) {
    return this.props.allUsersList.filter(user => user.toLowerCase().includes(text.toLowerCase()));
  }
}


// create dynamic user list for all filtered users
function UsersList({users}) {
  if (users.length > 0) {
    return (
      <div>
        {users.map(user => <User key={user} name={user} />)}
      </div>
    )
  }

  return (
    <p>No results</p>
  )  
}


// single user row
function User({name}) {
  return (
    <div className="user">
      <Image style={userStyles} name={name} />
      <p style={userStyles}>{name}</p>
    </div>
  )
}


// user avatar
function Image({name}) {
  const imgUrl = `https://api.adorable.io/avatars/55/${name}.png`;
  return (
    <img src={imgUrl} className="user_avatar" />
  );
}

export default FriendListComponent;
