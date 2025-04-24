// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title VoterRegistry
 * @dev Contract for managing voter registration and status
 */
contract VoterRegistry {
    struct Voter {
        string name;
        bytes32 idHash;
        bool isRegistered;
        bool hasVoted;
        uint256 registrationTime;
    }
    
    mapping(address => Voter) public voters;
    address[] public voterAddresses;
    
    event VoterRegistered(address indexed voterAddress, string name, uint256 registrationTime);
    event VoterMarkedAsVoted(address indexed voterAddress);
    
    /**
     * @dev Register a new voter
     * @param _voterAddress Address of the voter
     * @param _name Name of the voter
     * @param _idHash Hash of the voter's ID (for verification)
     */
    function registerVoter(
        address _voterAddress,
        string memory _name,
        bytes32 _idHash
    ) external {
        require(!voters[_voterAddress].isRegistered, "Voter already registered");
        
        voters[_voterAddress] = Voter({
            name: _name,
            idHash: _idHash,
            isRegistered: true,
            hasVoted: false,
            registrationTime: block.timestamp
        });
        
        voterAddresses.push(_voterAddress);
        
        emit VoterRegistered(_voterAddress, _name, block.timestamp);
    }
    
    /**
     * @dev Mark a voter as having voted
     * @param _voterAddress Address of the voter
     */
    function markVoted(address _voterAddress) external {
        require(voters[_voterAddress].isRegistered, "Voter is not registered");
        require(!voters[_voterAddress].hasVoted, "Voter has already voted");
        
        voters[_voterAddress].hasVoted = true;
        
        emit VoterMarkedAsVoted(_voterAddress);
    }
    
    /**
     * @dev Check if a voter is registered
     * @param _voterAddress Address of the voter
     * @return Whether the voter is registered
     */
    function isRegistered(address _voterAddress) external view returns (bool) {
        return voters[_voterAddress].isRegistered;
    }
    
    /**
     * @dev Check if a voter has already voted
     * @param _voterAddress Address of the voter
     * @return Whether the voter has voted
     */
    function hasVoted(address _voterAddress) external view returns (bool) {
        return voters[_voterAddress].hasVoted;
    }
    
    /**
     * @dev Get voter information
     * @param _voterAddress Address of the voter
     * @return name Name of the voter
     * @return registrationTime Time when the voter registered
     * @return voted Whether the voter has voted
     */
    function getVoterInfo(address _voterAddress) external view returns (
        string memory name,
        uint256 registrationTime,
        bool voted
    ) {
        Voter memory voter = voters[_voterAddress];
        return (voter.name, voter.registrationTime, voter.hasVoted);
    }
    
    /**
     * @dev Get the total number of registered voters
     * @return Number of registered voters
     */
    function getVoterCount() external view returns (uint256) {
        return voterAddresses.length;
    }
    
    /**
     * @dev Get voter address by index
     * @param _index Index in the voter addresses array
     * @return Voter address
     */
    function getVoterAddressByIndex(uint256 _index) external view returns (address) {
        require(_index < voterAddresses.length, "Index out of bounds");
        return voterAddresses[_index];
    }
}
