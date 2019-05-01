# UpgradablePetShop

Base Project: Truffle Pet Shot
https://truffleframework.com/tutorials/pet-shop 

Goal : Update the Adoptions contract such that the business logic is abstracted into a Library and is upgradable. Each new feature is implemented as an upgrade.

To compile contracts
`truffle compile`

To migrate contracts in Ganache network
`truffle migrate`

To test contracts
`truffle test`

To start server
`npm run dev`

Resources : 
The Adoptions contract should act as the proxy contract. 
https://blog.zeppelinos.org/proxy-patterns/
https://medium.com/quillhash/how-to-write-upgradable-smart-contracts-in-solidity-d8f1b95a0e9a

Requirements:
If the first option is picked, only the creator of the contract should be allowed to upgrade the Adoption contract.
Frontend should appropriately reflect the new features implemented
Once a pet is adopted, only the owner/holder of the pet can invoke the additional features on that pet
100% Test Coverage

