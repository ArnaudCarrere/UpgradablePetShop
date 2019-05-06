pragma solidity ^0.5.0;

import './Adoption.sol';

contract Adoption_F1 is Adoption {

	// Transfer ownership of an adopted pet
	function transferOwnership(uint petId, address dest) public returns (address) {
		require(petId >= 0 && petId <= 15);
		require(adopters[petId] == msg.sender);

		adopters[petId] = dest;

		return adopters[petId];
	}


}
