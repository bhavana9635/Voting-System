// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title SecurityContract
 * @dev Contract for ensuring the security and integrity of the voting process
 */
contract SecurityContract {
    mapping(address => uint256) private lastActionTime;
    mapping(bytes32 => bool) private usedSignatures;
    
    uint256 public constant RATE_LIMIT_PERIOD = 5 minutes;
    
    event SecurityAlert(address indexed user, string reason);
    
    /**
     * @dev Validate a vote before it's cast
     * @param _voter Address of the voter
     * @return Whether the vote is valid
     */
    function validateVote(address _voter) external returns (bool) {
        // Check for rate limiting (prevent rapid transactions)
        if (block.timestamp - lastActionTime[_voter] < RATE_LIMIT_PERIOD) {
            emit SecurityAlert(_voter, "Rate limit exceeded");
            return false;
        }
        
        // Update last action time
        lastActionTime[_voter] = block.timestamp;
        
        // Additional security checks could be implemented here
        
        return true;
    }
    
    /**
     * @dev Verify a signature to prevent replay attacks
     * @param _signature Signature to verify
     * @return Whether the signature is valid and unused
     */
    function verifySignature(bytes32 _signature) external returns (bool) {
        if (usedSignatures[_signature]) {
            emit SecurityAlert(msg.sender, "Signature already used");
            return false;
        }
        
        usedSignatures[_signature] = true;
        return true;
    }
    
    /**
     * @dev Check if an address has been rate limited
     * @param _address Address to check
     * @return Whether the address is rate limited
     */
    function isRateLimited(address _address) external view returns (bool) {
        return (block.timestamp - lastActionTime[_address] < RATE_LIMIT_PERIOD);
    }
    
    /**
     * @dev Get time remaining until rate limit expires
     * @param _address Address to check
     * @return Time remaining in seconds
     */
    function getRateLimitTimeRemaining(address _address) external view returns (uint256) {
        uint256 timeSinceLastAction = block.timestamp - lastActionTime[_address];
        
        if (timeSinceLastAction >= RATE_LIMIT_PERIOD) {
            return 0;
        }
        
        return RATE_LIMIT_PERIOD - timeSinceLastAction;
    }
}
