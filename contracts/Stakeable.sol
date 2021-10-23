pragma solidity ^0.8.6;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract Stakeable is ERC20("xp", "XP", 0), ERC20Burnable {
    using SafeMath for uint256;
    IERC20 public pilot;

    mapping(address => uint256) public stakedPilot;
    mapping(address => uint256) public stakedXPilot;
    mapping(address => bool) public boosterReward;

    constructor(IERC20 _pilot) {
        pilot = _pilot;
    }

    // modifier onlyMinter() {
    //     require(msg.sender == address(this), "XPILOT:: NOT_MINTER");
    //     _;
    // }

    function mint(address to, uint256 value) internal {
        _mint(to, value);
    }

    function burn(uint256 _amount) public override {
        burn(_amount);
    }

    function stake(uint256 _amount, address _tokenAddress) external {
        if (_tokenAddress == address(pilot)) {
            uint256 balanceUser = pilot.balanceOf(msg.sender);
            require(_amount <= balanceUser, "insufficient balance");
            // uint256 totalPilot = pilot.balanceOf(address(this));
            uint256 totalSupplyXpilot = totalSupply();
            if (totalSupplyXpilot == 0) {
                mint(msg.sender, _amount);
            } else {
                uint256 ratio = IERC20(address(pilot)).balanceOf(address(this)).div(totalSupplyXpilot);
                uint256 what = ratio.mul(_amount);
                mint(msg.sender, what);
            }
            stakedPilot[msg.sender] = _amount;
            pilot.transferFrom(msg.sender, address(this), _amount);
        } else {
            uint256 balanceUser = balanceOf(msg.sender);
            require(_amount <= balanceUser, "insufficient balance");
            stakedXPilot[msg.sender] = stakedXPilot[msg.sender].add(_amount);
            boosterReward[msg.sender] = true;
            transferFrom(msg.sender, address(this), _amount);
        }
    }

    function unStake(uint256 _share, address _tokenAddress) public {
        if (_tokenAddress == address(pilot)) {
            uint256 pilotStaked = stakedPilot[msg.sender];
            require(_share <= pilotStaked, "Cant unstake amount more then staked");
            uint256 totalSupply = totalSupply();
            uint256 ratio = IERC20(address(pilot)).balanceOf(address(this)).div(totalSupply);
            uint256 what = ratio.mul(_share);
            stakedPilot[msg.sender] = stakedPilot[msg.sender].sub(_share);
            pilot.transfer(msg.sender, what);
            burn(_share);
        } else {
            uint256 pilotXStaked = stakedXPilot[msg.sender];
            require(_share <= pilotXStaked, "Cant unstake amount more then staked");
            stakedXPilot[msg.sender] = stakedXPilot[msg.sender].sub(_share);
            transfer(msg.sender, _share);
        }
    }
}
