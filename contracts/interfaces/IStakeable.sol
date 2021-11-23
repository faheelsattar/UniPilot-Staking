pragma solidity ^0.8.6;

interface IStakeable {
    event Staked(uint256 _amount, address indexed _tokenAddress, address indexed _owner);
    event UnStaked(
        uint256 _amount,
        address indexed _tokenAddress,
        address indexed _owner
    );

    function stake(uint256 _amount, address _tokenAddress) external;

    function unStake(uint256 _share, address _tokenAddress) external;
}
