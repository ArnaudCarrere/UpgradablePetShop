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
        petTemplate.find('.btn-update').attr('data-id', data[i].id);

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
      App.web3Provider = new Web3.providers.HttpProvider('127.0.0.1:7545');
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

    $.getJSON('Adoption_F2.json', function(data) {
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
    $(document).on("click", ".btn-update", function () {
      var petId = $(this).data('id');
      $(".modal-body #petIdUpdate").val(petId);
    });
    $(document).on('click', '.btn-sendTransfer', App.handleTransfer);
    $(document).on('click', '.btn-updatePetInfo', App.handlePetInfoUpdate);
  },

  markAdopted: async function(adopters, account){
    var adoptionInstance;

    App.contracts.Proxy.deployed().then(function(proxy) {
      adoptionInstance = App.contracts.Adoption.at(proxy.address);

      return adoptionInstance.getAdopters.call();
    }).then( async function(adopters) {
      for (i = 0; i < adopters.length; i++) {
        $('.panel-pet').eq(i).find('.pet-adopter').text(adopters[i].substring(0, 21));
        $('.panel-pet').eq(i).find('.pet-adopter-end').text(adopters[i].substring(21, 42));
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').eq(2).show();
          $('.panel-pet').eq(i).find('button').eq(1).show();
          $('.panel-pet').eq(i).find('button').eq(0).hide();
          //Check for pet info update on the blockchain
          await adoptionInstance.petInfo(i).then(function(petInfo){
            console.log()
            $('.panel-pet').eq(i).find('.img-rounded').attr('src', petInfo[0]);
            $('.panel-pet').eq(i).find('.panel-title').text(petInfo[1]);
            $('.panel-pet').eq(i).find('.pet-age').text(petInfo[2]);
            $('.panel-pet').eq(i).find('.pet-breed').text(petInfo[3]);
            $('.panel-pet').eq(i).find('.pet-location').text(petInfo[4]);
          });
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
    var picture = $('.panel-pet').eq(petId).find('.img-rounded').attr('src');
    var name = $('.panel-pet').eq(petId).find('.panel-title').text();
    var age = $('.panel-pet').eq(petId).find('.pet-age').text() ;
    var breed = $('.panel-pet').eq(petId).find('.pet-breed').text() ;
    var location = $('.panel-pet').eq(petId).find('.pet-location').text() ;

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
      }).then(function(result){
        console.log('Registered')
        return adoptionInstance.registerPet(petId, picture, name, age, breed, location);
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
  },

  handlePetInfoUpdate: function(event) {
    event.preventDefault();

    var petId = parseInt($(".modal-body #petIdUpdate").val());
    var img = String($(".modal-body #newImage").val());
    var name = String($(".modal-body #newName").val());
    var age = parseInt($(".modal-body #newAge").val());
    var location = String($(".modal-body #newLocation").val());
    var adoptionInstance;
    console.log(petId);

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Proxy.deployed().then(function(proxy) {
        adoptionInstance = App.contracts.Adoption.at(proxy.address);

        // Execute, if needed, functions to update pet info on the blockchain
        if (img){
          //Json update
          $.getJSON('../pets.json', function(data) {
        	   data[petId].picture = img;
          });
          //Update on the blockchain
          return adoptionInstance.updatePicture(petId, img);
        }
        if (name){
          $.getJSON('../pets.json', function(data) {
             data[petId].name = name;
          });
          return adoptionInstance.updateName(petId, name);
        }
        if (age){
          $.getJSON('../pets.json', function(data) {
             data[petId].age = age;
          });
          return adoptionInstance.updateAge(petId, age);
        }
        if (location){
          $.getJSON('../pets.json', function(data) {
             data[petId].location = location;
          });
          return adoptionInstance.updateName(petId, location);
        }
      }).then(function(result) {
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  saveText: function(text, filename){
    var a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-u,'+encodeURIComponent(text));
    a.setAttribute('download', filename);
    a.click()
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
