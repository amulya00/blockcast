pragma solidity >=0.7.0 <0.9.0;

contract chatroom {
    
    event NewMessage(string message, address user, uint timestamp, string roomName);

    address owner;

    struct Message {
        string message;
        address user;
        uint timestamp;
    }

    mapping(string => Message[]) roomNameToMessages;
    mapping(address => string) addressToUsername;

    function chatroom() public {
        owner = msg.sender;
    }
    

    // Send a message to a room

    function sendMessage(string _msg, string _roomName) external {
        Message memory message = Message(_msg, msg.sender, block.timestamp);
        roomNameToMessages[_roomName].push(message);
        NewMessage(_msg, msg.sender, block.timestamp, _roomName);
    }

    // Functions for creating and fetching custom usernames. If a user updates
    // their username it will update for all of their messages

    function createUser(string _name) external {
        addressToUsername[msg.sender] = _name;
    }


    function getUsernameForAddress(address _user) external view returns (string) {
        return addressToUsername[_user];
    }


    // There is no support for returning a struct to web3, so this needs to be
    // returned as multiple items. This will throw an error if the index is invalid

    function getMessageByIndexForRoom(string _roomName, uint _index) external view returns (string, address, uint) {
        Message memory message = roomNameToMessages[_roomName][_index];
        return (message.message, message.user, message.timestamp);
    }

    function kill() external {
        if (owner == msg.sender) {
            owner.send(this.balance)
        }
    }
}
