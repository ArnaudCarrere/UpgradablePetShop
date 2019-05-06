var Adoption_F2 = artifacts.require("Adoption_F2");
var AdoptionStorage = artifacts.require("OwnedUpgradeabilityProxy");

module.exports = function(deployer) {
	deployer.deploy(Adoption_F2).
	then(() => {
    	AdoptionStorage.deployed().then(inst => {
    		return inst.upgradeTo(Adoption_F2.address);
    	});
	});
};
