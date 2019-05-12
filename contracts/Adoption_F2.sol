pragma solidity ^0.5.0;

import './Adoption_F1.sol';

contract Adoption_F2 is Adoption_F1 {

  struct petStruct {
    string picture;
    string name;
    uint8 age;
    string breed;
    string location;
  }

  modifier onlyPetOwner(uint petId){
    require(petId >= 0 && petId <= 15);
    require(adopters[petId] == msg.sender);
    _;
  }

  petStruct[16] public petInfo;

  // Register a pet - store its info in the blockchain - while adopting
  function registerPet(
    uint petId,
    string memory picture,
    string memory name,
    uint8 age,
    string memory breed,
    string memory location)
    public returns (uint){

    require(petId >= 0 && petId <= 15);
    petInfo[petId] = petStruct(picture, name, age, breed, location);
    return petId;
  }

  //Update image giving its url
  function updatePicture(uint petId, string memory url) public onlyPetOwner(petId) returns (string memory){
    petInfo[petId].picture = url;
    return petInfo[petId].picture;
  }

  //Update name
  function updateName(uint petId, string memory newName) public  onlyPetOwner(petId)returns (string memory){
    petInfo[petId].name = newName;
    return petInfo[petId].name;
  }

  //Update age
  function updateAge(uint petId, uint8 newAge) public  onlyPetOwner(petId)returns (uint8){
    petInfo[petId].age = newAge;
    return petInfo[petId].age;
  }

  //Update image giving its url
  function updateLocation(uint petId, string memory newLocation) public onlyPetOwner(petId) returns (string memory){
    petInfo[petId].location = newLocation;
    return petInfo[petId].location;
  }

}
