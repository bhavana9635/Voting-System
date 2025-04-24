// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title ResultsContract
 * @dev Contract for managing election results
 */
contract ResultsContract {
    mapping(uint256 => uint256) public candidateVotes;
    uint256 public totalVotes;
    
    event ResultsReset();
    event VoteRecorded(uint256 candidateId, uint256 newTotal);
    
    /**
     * @dev Reset results for a new election
     * @param _candidateCount Number of candidates
     */
    function resetResults(uint256 _candidateCount) external {
        totalVotes = 0;
        
        for (uint256 i = 1; i <= _candidateCount; i++) {
            candidateVotes[i] = 0;
        }
        
        emit ResultsReset();
    }
    
    /**
     * @dev Increment vote count for a candidate
     * @param _candidateId ID of the candidate
     */
    function incrementVoteCount(uint256 _candidateId) external {
        candidateVotes[_candidateId]++;
        totalVotes++;
        
        emit VoteRecorded(_candidateId, candidateVotes[_candidateId]);
    }
    
    /**
     * @dev Get the total number of votes cast
     * @return Total vote count
     */
    function getTotalVotes() external view returns (uint256) {
        return totalVotes;
    }
    
    /**
     * @dev Get the vote count for a specific candidate
     * @param _candidateId ID of the candidate
     * @return Vote count for the candidate
     */
    function getCandidateVotes(uint256 _candidateId) external view returns (uint256) {
        return candidateVotes[_candidateId];
    }
    
    /**
     * @dev Calculate the percentage of votes for a candidate
     * @param _candidateId ID of the candidate
     * @return Percentage of votes (0-100)
     */
    function getCandidatePercentage(uint256 _candidateId) external view returns (uint256) {
        if (totalVotes == 0) {
            return 0;
        }
        
        return (candidateVotes[_candidateId] * 100) / totalVotes;
    }
}
