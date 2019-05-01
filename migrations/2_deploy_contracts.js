var Adoption = artifacts.require("Adoption");
var UnstructuredProxy = artifacts.require("UnstructuredProxy");

module.exports = function(deployer) {
  deployer.deploy(Adoption);
  deployer.deploy(UnstructuredProxy);
};