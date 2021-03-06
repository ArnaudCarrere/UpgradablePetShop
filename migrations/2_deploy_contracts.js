var Adoption = artifacts.require("Adoption");
var AdoptionStorage = artifacts.require("OwnedUpgradeabilityProxy");

module.exports = function(deployer) {
	deployer.deploy(Adoption);
	deployer.deploy(AdoptionStorage).
	then(() => {
    	AdoptionStorage.deployed().then(inst => {
    		return inst.upgradeTo(Adoption.address);
    	});
	});
};
