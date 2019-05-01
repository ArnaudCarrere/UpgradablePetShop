var Adoption = artifacts.require("Adoption");
var UnstructuredProxy = artifacts.require("UnstructuredProxy");

let logic;
let proxy;

module.exports = deployer => {
  console.log('PetShop Initialization started!');
  deployer
    .then(() => Adoption.deployed())
    .then(function(instance) {
      logic = instance;
      return UnstructuredProxy.deployed();
    })
    .then(function(instance) {
      proxy = instance;
      return proxy.upgradeTo(logic.address);
    })
    .then(function() {
      console.log('PetShop Initialization completed, Proxy Address: ', proxy.address);
    });
};