var AdoptionV1 = artifacts.require("Adoption");
var AdoptionStorage = artifacts.require("OwnedUpgradeabilityProxy");

module.exports = function(deployer) {	
	deployer.deploy(AdoptionV1);
	deployer.deploy(AdoptionStorage).
	then(() => {
    	AdoptionStorage.deployed().then(inst => {
    		return inst.upgradeTo(AdoptionV1.address);
    	});
	});
};