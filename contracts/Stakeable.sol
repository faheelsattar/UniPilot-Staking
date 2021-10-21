pragma solidity ^0.8.4;
import "./XPilot.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Stakebale {
    IERC20 public pilot;
    XPilot public xPilot;

    mapping(address => uint256) internal pilotStaked;
    mapping(address => uint256) internal xPilotStaked;

    event Staked(address indexed user, uint256 amount);

    constructor(IERC20 _pilot, XPilot _xPilot) {
        pilot = _pilot;
        xPilot = _xPilot;
    }

    function _stakePilot(uint256 _amount, address user) private {
        require(_amount > 0, "Cannot stake nothing");
        pilotStaked[user] += _amount;
        xPilot.mint(user, _amount);
        emit Staked(user, _amount);
    }

    function _stakeXPilot(uint256 _amount, address user) private {
        require(_amount > 0, "Cannot stake nothing");
        xPilotStaked[user] += _amount;
        //we will need to call Farming contract to update and add the booster reward in block reward
        emit Staked(user, _amount);
    }

    function stakePilot(uint256 _amount) public {
        require(_amount <= pilot.balanceOf(msg.sender), "Balance cant be less then amount");
        uint256 amountHldr = _amount;
        _amount = 0;
        _stakePilot(amountHldr, msg.sender);
        pilot.transferFrom(msg.sender, address(this), amountHldr);
    }

    function stakeXPilot(uint256 _amount) public {
        require(_amount <= xPilot.balanceOf(msg.sender), "Balance cant be less then amount");
        uint256 amountHldr = _amount;
        _amount = 0;
        _stakeXPilot(amountHldr, msg.sender);
        xPilot.transferFrom(msg.sender, address(this), amountHldr);
    }
}
