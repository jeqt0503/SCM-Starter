pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;
    
    uint256 public platinumPrice = 200;
    uint256 public goldPrice = 150;
    uint256 public silverPrice = 75;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event TicketBooked(string ticketType);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns(uint256) {
        return balance;
    }

    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        balance += msg.value;
        emit Deposit(msg.value);
    }

    function bookTicket(string memory _ticketType) public payable {
        require(msg.value > 0, "Booking amount must be greater than 0");
        
        if (keccak256(abi.encodePacked(_ticketType)) == keccak256(abi.encodePacked("platinum"))) {
            balance -= msg.value;
            emit TicketBooked(_ticketType);
        } else if (keccak256(abi.encodePacked(_ticketType)) == keccak256(abi.encodePacked("gold"))) {
            balance -= msg.value;
            emit TicketBooked(_ticketType);
        } else if (keccak256(abi.encodePacked(_ticketType)) == keccak256(abi.encodePacked("silver"))) {
            balance -= msg.value;
            emit TicketBooked(_ticketType);
        } else {
            revert("Invalid ticket type");
        }
    }
}
