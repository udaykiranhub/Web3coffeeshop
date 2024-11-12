// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

// import {Test, console} from "forge-std/Test.sol";
import "forge-std/Test.sol";

import {coffeeShop} from "../src/coffeeShop.sol";

contract CounterTest is Test {
    coffeeShop public cft;

    function setUp() public {
      cft = new coffeeShop(5,address(0x123));
       
    }

}
