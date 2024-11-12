// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../src/token.sol";
import "../src/coffeeShop.sol";
import "forge-std/Script.sol";  

contract CounterScript is Script {
    function run() external {
        // uint256 deployerPrivateKey = 0x2308ed3ed7bc60d1007c703b26785947dd93a54685cae0b924640c0f6643d079; // Direct private key

        // // Start broadcasting transactions
        vm.startBroadcast();

        // Deploy MyToken
        MyToken myToken = new MyToken();

        uint limit = 5; // Set your coffee limit
        coffeeShop shop = new coffeeShop(limit, address(myToken));

        vm.stopBroadcast();

        // Log deployed contract addresses
        console.log("MyToken deployed at:", address(myToken));
        console.log("coffeeShop deployed at:", address(shop));
    }
}
