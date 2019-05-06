var Adopters = artifacts.require("Adopters");
var Adoption = artifacts.require("Adoption");
var Proxy = artifacts.require("Proxy");

module.exports = function(deployer) {
  deployer.deploy(Adoption);
  deployer.deploy(Proxy)
	.then(() => {
    	Proxy.deployed().then(inst => {
    		return inst.upgradeTo(Adoption.address);
    	});
	});
};
