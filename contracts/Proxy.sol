pragma solidity ^0.5.0;

import "./Ownable.sol";
import "./Adopters.sol";

contract Proxy is Adopters , Ownable {

  event Upgraded(address indexed implementation);

  address public _implementation;

  function implementation() public view returns (address) {
    return _implementation;
  }

  function upgradeTo(address impl) public onlyOwner {
    require(_implementation != impl);
    _implementation = impl;
    emit Upgraded(impl);
  }

  function () payable external {
    address _impl = implementation();
    require(_impl != address(0));
    bytes memory data = msg.data;

    assembly {
      let ptr := mload(0x40)
      calldatacopy(ptr,0,calldatasize)
      let result := delegatecall(gas, _impl, ptr, calldatasize, 0, 0)
      let size := returndatasize
      returndatacopy(ptr, 0, size)

      switch result
      case 0 { revert(ptr, size) }
      default { return(ptr, size) }
    }
  }

}
