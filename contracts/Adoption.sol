pragma solidity ^0.5.0;

import "./Adopters.sol";

contract Adoption is Adopters {

	// Adopting a pet
	function adopt(uint petId) public returns (uint) {
		require(petId >= 0 && petId <= 15);

		_adopters[petId] = msg.sender;

		return petId;
	}

	// Retrieving the adopters
	function getAdopters() public view returns (address[16] memory) {
		return _adopters;
	}
}
