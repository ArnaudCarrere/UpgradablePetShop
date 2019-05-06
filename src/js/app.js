App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);
        petTemplate.find('.btn-unadopt').attr('data-id', data[i].id);
        petTemplate.find('.btn-transfer').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
   // Modern dapp browsers...
   if (window.ethereum) {
     App.web3Provider = window.ethereum;
     try {
       // Request account access
       await window.ethereum.enable();
     } catch (error) {
       // User denied account access...
       console.error("User denied account access")
     }
   }
   // Legacy dapp browsers...
   else if (window.web3) {
     App.web3Provider = window.web3.currentProvider;
   }
   // If no injected web3 instance is detected, fall back to Ganache
   else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('OwnedUpgradeabilityProxy.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var ProxyArtifact = data;
      App.contracts.Proxy = TruffleContract(ProxyArtifact);

      // Set the provider for our contract
      App.contracts.Proxy.setProvider(App.web3Provider);
    });

    $.getJSON('Adoption_F1.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);

      // Set the provider for our contract
      App.contracts.Adoption.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      return App.markAdopted();
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
    $(document).on('click', '.btn-unadopt', App.handleUnadopt);
    $(document).on("click", ".btn-transfer", function () {
      var petId = $(this).data('id');
      $(".modal-body #petId").val(petId);
    });
    $(document).on('click', '.btn-sendTransfer', App.handleTransfer);
  },

  markAdopted: function(adopters, account) {
    var adoptionInstance;

    App.contracts.Proxy.deployed().then(function(proxy) {
      adoptionInstance = App.contracts.Adoption.at(proxy.address);

      return adoptionInstance.getAdopters.call();
    }).then(function(adopters) {
      for (i = 0; i < adopters.length; i++) {
        $('.panel-pet').eq(i).find('.pet-adopter').text(adopters[i].substring(0, 21));
        $('.panel-pet').eq(i).find('.pet-adopter-end').text(adopters[i].substring(21, 42));
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').eq(2).show();
          $('.panel-pet').eq(i).find('button').eq(1).show();
          $('.panel-pet').eq(i).find('button').eq(0).hide();
        } else {
          $('.panel-pet').eq(i).find('.pet-adopter').text("None");
          $('.panel-pet').eq(i).find('.pet-adopter-end').text("");
          $('.panel-pet').eq(i).find('button').eq(2).hide();
          $('.panel-pet').eq(i).find('button').eq(1).hide();
          $('.panel-pet').eq(i).find('button').eq(0).show();
        }
      }
    }).catch(function(err) {
    console.log(err.message);
  });
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));
    var adoptionInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Proxy.deployed().then(function(proxy) {
        adoptionInstance = App.contracts.Adoption.at(proxy.address);

        // Execute adopt as a transaction by sending account
        return adoptionInstance.adopt(petId, {from: account});
      }).then(function(result) {
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleUnadopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));
    var adoptionInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Proxy.deployed().then(function(proxy) {
        adoptionInstance = App.contracts.Adoption.at(proxy.address);

        // Execute adopt as a transaction by sending account
        return adoptionInstance.transferOwnership(petId, '0x0000000000000000000000000000000000000000', {from: account});
      }).then(function(result) {
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleTransfer: function(event) {
    event.preventDefault();

    var petId = parseInt($(".modal-body #petId").val());
    var dest = String($(".modal-body #recipientAddress").val());
    var adoptionInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Proxy.deployed().then(function(proxy) {
        adoptionInstance = App.contracts.Adoption.at(proxy.address);

        // Execute adopt as a transaction by sending account
        return adoptionInstance.transferOwnership(petId, dest, {from: account});
      }).then(function(result) {
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
