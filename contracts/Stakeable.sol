pragma solidity ^0.8.6;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "./interfaces/IStakeable.sol";

contract Stakeable is ERC20("xp", "XP", 0), ERC20Burnable, IStakeable {
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

    function stake(uint256 _amount, address _tokenAddress) external override {
        if (_tokenAddress == address(pilot)) {
            uint256 balanceUser = pilot.balanceOf(msg.sender);
            require(_amount <= balanceUser, "insufficient balance");
            // uint256 totalPilot = pilot.balanceOf(address(this));
            uint256 totalSupplyXpilot = totalSupply();
            if (totalSupplyXpilot == 0) {
                mint(msg.sender, _amount);
            } else {
                uint256 product = IERC20(address(pilot)).balanceOf(address(this)).mul(
                    _amount
                );
                uint256 what = product.div(totalSupplyXpilot);
                mint(msg.sender, what);
            }
            stakedPilot[msg.sender] = stakedPilot[msg.sender].add(_amount);
            pilot.transferFrom(msg.sender, address(this), _amount);
        } else {
            uint256 balanceUser = balanceOf(msg.sender);
            require(_amount <= balanceUser, "insufficient balance");
            stakedXPilot[msg.sender] = stakedXPilot[msg.sender].add(_amount);
            boosterReward[msg.sender] = true;
            transferFrom(msg.sender, address(this), _amount);
        }
        emit Staked(_amount, _tokenAddress, msg.sender);
    }

    function unStake(uint256 _share, address _tokenAddress) external override {
        if (_tokenAddress == address(pilot)) {
            uint256 pilotStaked = stakedPilot[msg.sender];
            require(_share <= pilotStaked, "Cant unstake amount");
            uint256 totalSupplyXpilot = totalSupply();
            uint256 product = IERC20(address(pilot)).balanceOf(address(this)).mul(_share);
            uint256 what = product.div(totalSupplyXpilot);
            stakedPilot[msg.sender] = stakedPilot[msg.sender].sub(_share);
            pilot.transfer(msg.sender, what);
            burn(_share);
        } else {
            uint256 pilotXStaked = stakedXPilot[msg.sender];
            require(_share <= pilotXStaked, "Cant unstake amount");
            uint256 remainingStake = stakedXPilot[msg.sender].sub(_share);
            stakedXPilot[msg.sender] = remainingStake;
            if (remainingStake == 0) {
                boosterReward[msg.sender] = false;
            }
            transfer(msg.sender, _share);
        }
        emit UnStaked(_share, _tokenAddress, msg.sender);
    }
}
