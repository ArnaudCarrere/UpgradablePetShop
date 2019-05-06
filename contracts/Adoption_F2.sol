pragma solidity ^0.5.0;

import './Adoption_F1.sol';

contract Adoption_F2 is Adoption_F1 {

  struct petInfo {
    address owner;
    string picture;
    string name;
    uint8 age;
    string breed;
    string location;
  }

  modifier onlyPetOwner(uint petId){
    require(petId >= 0 && petId <= 15);
    require(adopters[petId].owner == msg.sender);
    _;
  }

  petInfo[16] public adopters;

  // Adopting a pet
  function adopt(
    uint petId,
    string memory picture,
    string memory name,
    uint8 age,
    string memory breed,
    string memory location)
    public returns (uint){

    require(petId >= 0 && petId <= 15);
    adopters[petId] = petInfo(msg.sender, picture, name, age, breed, location);

    return petId;
  }

	// Transfer ownership of an adopted pet
	function transferOwnership(uint petId, address dest) public onlyPetOwner(petId) returns (address) {
		adopters[petId].owner = dest;
		return adopters[petId].owner;
	}

  //Update image giving its url
  function updatePicture(uint petId, string memory url) public onlyPetOwner(petId) returns (string memory){
    adopters[petId].picture = url;
    return adopters[petId].picture;
  }

  //Update name
  function updateName(uint petId, string memory newName) public onlyPetOwner(petId) returns (string memory){
    adopters[petId].name = newName;
    return adopters[petId].name;
  }

  //Update age
  function updateAge(uint petId, uint8 newAge) public onlyPetOwner(petId) returns (uint8){
    adopters[petId].age = newAge;
    return adopters[petId].age;
  }

  //Update image giving its url
  function updateLocation(uint petId, string memory newLocation) public onlyPetOwner(petId) returns (string memory){
    adopters[petId].location = newLocation;
    return adopters[petId].location;
  }

}
