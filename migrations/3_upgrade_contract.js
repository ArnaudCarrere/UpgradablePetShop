var Adoption_F1 = artifacts.require("Adoption_F1");
var AdoptionStorage = artifacts.require("OwnedUpgradeabilityProxy");

module.exports = function(deployer) {	
	deployer.deploy(Adoption_F1).
	then(() => {
    	AdoptionStorage.deployed().then(inst => {
    		return inst.upgradeTo(Adoption_F1.address);
    	});
	});
};