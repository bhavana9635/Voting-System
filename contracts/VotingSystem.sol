// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./VoterRegistry.sol";
import "./BallotContract.sol";
import "./ResultsContract.sol";
import "./SecurityContract.sol";

/**
 * @title VotingSystem
 * @dev Main contract that orchestrates the entire voting system
 */
contract VotingSystem {
    address public admin;
    VoterRegistry public voterRegistry;
    BallotContract public ballotContract;
    ResultsContract public resultsContract;
    SecurityContract public securityContract;
    
    bool public electionActive;
    string public electionTitle;
    uint256 public electionStartTime;
    uint256 public electionEndTime;
    
    event ElectionCreated(string title, uint256 startTime, uint256 endTime);
    event ElectionEnded(string title, uint256 endTime);
    event VoteCast(address indexed voter, uint256 candidateId);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }
    
    modifier electionIsActive() {
        require(electionActive, "No active election");
        require(block.timestamp >= electionStartTime, "Election has not started yet");
        require(block.timestamp <= electionEndTime, "Election has ended");
        _;
    }
    
    constructor() {
        admin = msg.sender;
        voterRegistry = new VoterRegistry();
        ballotContract = new BallotContract();
        resultsContract = new ResultsContract();
        securityContract = new SecurityContract();
        
        electionActive = false;
    }
    
    /**
     * @dev Create a new election
     * @param _title Title of the election
     * @param _startTime Start time of the election (unix timestamp)
     * @param _endTime End time of the election (unix timestamp)
     * @param _candidateNames Array of candidate names
     */
    function createElection(
        string memory _title,
        uint256 _startTime,
        uint256 _endTime,
        string[] memory _candidateNames
    ) external onlyAdmin {
        require(!electionActive, "An election is already active");
        require(_startTime > block.timestamp, "Start time must be in the future");
        require(_endTime > _startTime, "End time must be after start time");
        require(_candidateNames.length > 1, "Need at least two candidates");
        
        electionTitle = _title;
        electionStartTime = _startTime;
        electionEndTime = _endTime;
        electionActive = true;
        
        // Initialize the ballot with candidates
        ballotContract.initializeBallot(_candidateNames);
        
        // Reset results for the new election
        resultsContract.resetResults(_candidateNames.length);
        
        emit ElectionCreated(_title, _startTime, _endTime);
    }
    
    /**
     * @dev End the current election
     */
    function endElection() external onlyAdmin {
        require(electionActive, "No active election to end");
        
        electionActive = false;
        emit ElectionEnded(electionTitle, block.timestamp);
    }
    
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
    ) external onlyAdmin {
        voterRegistry.registerVoter(_voterAddress, _name, _idHash);
    }
    
    /**
     * @dev Cast a vote for a candidate
     * @param _candidateId ID of the candidate
     */
    function castVote(uint256 _candidateId) external electionIsActive {
        // Check if voter is registered
        require(voterRegistry.isRegistered(msg.sender), "Voter is not registered");
        
        // Check if voter has already voted
        require(!voterRegistry.hasVoted(msg.sender), "Voter has already cast a vote");
        
        // Check if the vote is secure
        require(securityContract.validateVote(msg.sender), "Vote validation failed");
        
        // Cast the vote
        ballotContract.castVote(_candidateId);
        
        // Mark voter as having voted
        voterRegistry.markVoted(msg.sender);
        
        // Update results
        resultsContract.incrementVoteCount(_candidateId);
        
        emit VoteCast(msg.sender, _candidateId);
    }
    
    /**
     * @dev Get the total number of votes cast
     * @return Total vote count
     */
    function getTotalVotes() external view returns (uint256) {
        return resultsContract.getTotalVotes();
    }
    
    /**
     * @dev Get the vote count for a specific candidate
     * @param _candidateId ID of the candidate
     * @return Vote count for the candidate
     */
    function getCandidateVotes(uint256 _candidateId) external view returns (uint256) {
        return resultsContract.getCandidateVotes(_candidateId);
    }
    
    /**
     * @dev Get candidate information
     * @param _candidateId ID of the candidate
     * @return Candidate name
     */
    function getCandidateInfo(uint256 _candidateId) external view returns (string memory) {
        return ballotContract.getCandidateName(_candidateId);
    }
    
    /**
     * @dev Get the number of candidates
     * @return Number of candidates
     */
    function getCandidateCount() external view returns (uint256) {
        return ballotContract.getCandidateCount();
    }
    
    /**
     * @dev Check if a voter is registered
     * @param _voter Address of the voter
     * @return Whether the voter is registered
     */
    function isVoterRegistered(address _voter) external view returns (bool) {
        return voterRegistry.isRegistered(_voter);
    }
    
    /**
     * @dev Check if a voter has already voted
     * @param _voter Address of the voter
     * @return Whether the voter has voted
     */
    function hasVoterVoted(address _voter) external view returns (bool) {
        return voterRegistry.hasVoted(_voter);
    }
    
    /**
     * @dev Get election status
     * @return active Whether the election is active
     * @return title Title of the election
     * @return startTime Start time of the election
     * @return endTime End time of the election
     */
    function getElectionStatus() external view returns (
        bool active,
        string memory title,
        uint256 startTime,
        uint256 endTime
    ) {
        return (electionActive, electionTitle, electionStartTime, electionEndTime);
    }
}
