// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract Crowfunding {
    address public owner = 0xF55301514c27489Fde7C9cd9A3EA8044E7E04579;
    uint256 public goal;
    uint256 public deadLine;
    uint256 public totalContribution;

    mapping (address => uint256) contributions;

    constructor (uint256 _goal, uint256 _minutes) {
        goal = _goal;
        deadLine = block.timestamp +_minutes * 1 minutes;
    }

    function contribute () external payable {
        require(block.timestamp < deadLine, "Campana finalizada!");
        require(msg.value > 0, "Sin envio de bTNB");
        require(msg.sender.balance > 0.01 ether + msg.value, "Sin saldo");
        require(contributions[msg.sender] < 1 ether, "Ya llegaste al tope de donaciones. Gracias");
        totalContribution += msg.value;
        contributions[msg.sender] = msg.value;
    }

    function refund () external {
        require(block.timestamp > deadLine, "Campana sin finalizar!");
        require(totalContribution < goal, "Se llego al objetivo");
        require(contributions[msg.sender] > 0, "No contribuiste");

        (bool ok, ) = payable(msg.sender).call{value:contributions[msg.sender]}("");
        require(ok, "Fallo al enviar fondos");

        totalContribution = totalContribution - contributions[msg.sender];
        contributions[msg.sender] = 0; 
    }

    function ownerWithdraw () external {
        require(msg.sender == owner, "Solo el owner puede retirar");
        require(block.timestamp > deadLine, "Campana sin finalizar!");
        require(totalContribution >= goal, "No se llego al objetivo");
        
        (bool ok, ) = payable(owner).call{value:address(this).balance}("");
        require(ok, "Fallo al enviar fondos");

        totalContribution = 0;

    }
}