# UpgradablePetShop

Base Project: Truffle Pet Shot
https://truffleframework.com/tutorials/pet-shop 

## Goal
Update the Adoptions contract such that the business logic is abstracted into a Library and is upgradable. Each new feature is implemented as an upgrade.
- Compile contracts
`truffle compile`
- Start the local Ganache network
`ganache-cli --port 7545`
- Migrate contracts in Ganache network
`truffle migrate`
- Test contracts
`truffle test`
- Start server and adopt pets (use the provided mnemonic to connect with Metamask)
`npm run dev`

## Resources : 
The Adoptions contract should act as the proxy contract. 
https://blog.zeppelinos.org/proxy-patterns/
https://medium.com/quillhash/how-to-write-upgradable-smart-contracts-in-solidity-d8f1b95a0e9a

## Requirements:
- Only the creator of the contract should be allowed to upgrade the Adoption contract.
- Frontend should appropriately reflect the new features implemented.
- Once a pet is adopted, only the owner/holder of the pet can invoke the additional features on that pet.
- 100% Test Coverage

## EASY FEATURES:
1. Transfer ownership of an adopted pet to another address AND un-adopt a pet. Each pet should list it’s current “adopter”.
2. Attach an image to each pet(url in the blockchain). Also should be updatable by the owner and rendered in the frontend. A default pet image can be used for non-adopted pets.
3. Attach names/age/location/etc to each pet in the blockchain. Also should be editable by only the owner.
4. Remove the cap of 16 pets. Allow the creation/deletion of pets. Only the owner should be able to delete the pet. The creator of the pet implicitly adopts the pet.
5. Allow the adopter to place a price their pet. Another address should be able to purchase the pet from the adopter. The money is given to the original adopter’s account.

## HARD FEATURES:
6. Allow two pets owned by the same address to breed a new pet.
   - Pets should have a reference to their children and vice versa
   - The adopter must have had both pets for at least 1 hour before being able to breed the two pets. Tip: Time can be “fast-forwarded” in ganache to help write unit tests for this
   - The adopter should also be the “owner” of the newly bred pet. A random name can be picked for the bred pet.
7. Let the adopter temporarily let another address “borrow” the pet for some duration. The person who borrowed the pet should not be able to transfer ownership of the pet but is allowed to have another address “re-borrow” for the remaining duration
   - A (owner) -> B (1 week) 
   - 2 days pass. B -> C (5 days remaining)
   - Frontend should reflect the owner of the pet and the current holder of the pet and what duration is left.
8. Allow pets to be fed. If they are not fed by the adopter within 1 day, the pet is dead (“burned”) and no action can be taken on the dead pet.
