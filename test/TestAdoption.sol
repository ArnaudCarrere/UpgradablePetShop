pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption_F2.sol";
import "../contracts/OwnedUpgradeabilityProxy.sol";

contract TestAdoption {
	// The address of the adoption contract to be tested
	Adoption_F2 adoption = Adoption_F2(DeployedAddresses.OwnedUpgradeabilityProxy());

	// The id of the pet that will be used for testing
	uint expectedPetId = 8;

	//The expected owner of adopted pet is this contract
	address expectedAdopter = address(this);

	// Testing the adopt() function
	function testUserCanAdoptPet() public {
		uint returnedId = adoption.adopt(expectedPetId);

		Assert.equal(returnedId, expectedPetId, "Adoption of the expected pet should match what is returned.");
	}

	// Testing retrieval of a single pet's owner
	function testGetAdopterAddressByPetId() public {
		address adopter = adoption.adopters(expectedPetId);

		Assert.equal(adopter, expectedAdopter, "Owner of the expected pet should be this contract");
	}

	// Testing retrieval of all pet owners
	function testGetAdopterAddressByPetIdInArray() public {
		// Store adopters in memory rather than contract's storage
		address[16] memory adopters = adoption.getAdopters();

		Assert.equal(adopters[expectedPetId], expectedAdopter, "Owner of the expected pet should be this contract");
	}

	// Testing transfer of ownership of owned pet
	function testTransferPetOwnershipByPetId() public {
		address newOwner = adoption.transferOwnership(expectedPetId, address(0));

		Assert.equal(newOwner, address(0), "New owner of pet should be the null address");
	}

}
