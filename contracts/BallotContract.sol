// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title BallotContract
 * @dev Contract for managing the ballot and candidates
 */
contract BallotContract {
    struct Candidate {
        string name;
        bool exists;
    }
    
    mapping(uint256 => Candidate) public candidates;
    uint256 public candidateCount;
    
    event BallotInitialized(uint256 candidateCount);
    event VoteCast(uint256 candidateId);
    
    /**
     * @dev Initialize the ballot with candidates
     * @param _candidateNames Array of candidate names
     */
    function initializeBallot(string[] memory _candidateNames) external {
        require(candidateCount == 0, "Ballot already initialized");
        
        for (uint256 i = 0; i < _candidateNames.length; i++) {
            candidateCount++;
            candidates[candidateCount] = Candidate({
                name: _candidateNames[i],
                exists: true
            });
        }
        
        emit BallotInitialized(candidateCount);
    }
    
    /**
     * @dev Cast a vote for a candidate
     * @param _candidateId ID of the candidate
     */
    function castVote(uint256 _candidateId) external {
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate ID");
        require(candidates[_candidateId].exists, "Candidate does not exist");
        
        emit VoteCast(_candidateId);
    }
    
    /**
     * @dev Get candidate name
     * @param _candidateId ID of the candidate
     * @return Name of the candidate
     */
    function getCandidateName(uint256 _candidateId) external view returns (string memory) {
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate ID");
        return candidates[_candidateId].name;
    }
    
    /**
     * @dev Get the number of candidates
     * @return Number of candidates
     */
    function getCandidateCount() external view returns (uint256) {
        return candidateCount;
    }
    
    /**
     * @dev Check if a candidate exists
     * @param _candidateId ID of the candidate
     * @return Whether the candidate exists
     */
    function candidateExists(uint256 _candidateId) external view returns (bool) {
        return candidates[_candidateId].exists;
    }
}
