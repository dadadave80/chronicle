// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.5.0 <0.9.0;
pragma experimental ABIEncoderV2;

import {HederaResponseCodes} from "hedera-system-contracts/HederaResponseCodes.sol";
import {IHederaTokenService} from "hedera-token-service/IHederaTokenService.sol";

library LibSafeHTS {
    address private constant PRECOMPILE_ADDRESS = address(0x167);
    // 90 days in seconds
    int32 private constant DEFAULT_AUTO_RENEW_PERIOD = 7776000;

    error CryptoTransferFailed(int32 responseCode);
    error MintFailed(int32 responseCode);
    error BurnFailed(int32 responseCode);
    error MultipleAssociationsFailed(int32 responseCode);
    error SingleAssociationFailed(int32 responseCode);
    error MultipleDissociationsFailed(int32 responseCode);
    error SingleDissociationFailed(int32 responseCode);
    error TokensTransferFailed(int32 responseCode);
    error TokensTransferFromFailed(int32 responseCode);
    error NFTsTransferFailed(int32 responseCode);
    error TokenTransferFailed(int32 responseCode);
    error NFTTransferFailed(int32 responseCode);
    error CreateFungibleTokenFailed(int32 responseCode);
    error CreateFungibleTokenWithCustomFeesFailed(int32 responseCode);
    error CreateNonFungibleTokenFailed(int32 responseCode);
    error CreateNonFungibleTokenWithCustomFeesFailed(int32 responseCode);
    error ApproveFailed(int32 responseCode);
    error NFTApproveFailed(int32 responseCode);
    error SetTokenApprovalForAllFailed(int32 responseCode);
    error TokenDeleteFailed(int32 responseCode);
    error FreezeTokenFailed(int32 responseCode);
    error UnfreezeTokenFailed(int32 responseCode);
    error GrantTokenKYCFailed(int32 responseCode);
    error RevokeTokenKYCFailed(int32 responseCode);
    error PauseTokenFailed(int32 responseCode);
    error UnpauseTokenFailed(int32 responseCode);
    error WipeTokenAccountFailed(int32 responseCode);
    error WipeTokenAccountNFTFailed(int32 responseCode);
    error UpdateTokenInfoFailed(int32 responseCode);
    error UpdateTokenExpiryInfoFailed(int32 responseCode);
    error UpdateTokenKeysFailed(int32 responseCode);
    error UpdateTokenCustomFeesFailed(int32 responseCode);

    function safeCryptoTransfer(
        IHederaTokenService.TransferList memory transferList,
        IHederaTokenService.TokenTransferList[] memory tokenTransfers
    ) internal {
        (bool success, bytes memory result) = PRECOMPILE_ADDRESS.call(
            abi.encodeWithSelector(IHederaTokenService.cryptoTransfer.selector, transferList, tokenTransfers)
        );
        (bool htsSuccess, int32 responseCode) = tryDecodeSuccessResponseCode(success, result);
        if (!htsSuccess) revert CryptoTransferFailed(responseCode);
    }

    function safeMintToken(address token, int64 amount, bytes[] memory metadata)
        internal
        returns (int64 newTotalSupply, int64[] memory serialNumbers)
    {
        (bool success, bytes memory result) = PRECOMPILE_ADDRESS.call(
            abi.encodeWithSelector(IHederaTokenService.mintToken.selector, token, amount, metadata)
        );
        int32 responseCode;
        (responseCode, newTotalSupply, serialNumbers) = success
            ? abi.decode(result, (int32, int64, int64[]))
            : (HederaResponseCodes.UNKNOWN, int64(0), new int64[](0));
        if (responseCode != HederaResponseCodes.SUCCESS) revert MintFailed(responseCode);
    }

    function safeBurnToken(address token, int64 amount, int64[] memory serialNumbers)
        internal
        returns (int64 newTotalSupply)
    {
        (bool success, bytes memory result) = PRECOMPILE_ADDRESS.call(
            abi.encodeWithSelector(IHederaTokenService.burnToken.selector, token, amount, serialNumbers)
        );
        int32 responseCode;
        (responseCode, newTotalSupply) =
            success ? abi.decode(result, (int32, int64)) : (HederaResponseCodes.UNKNOWN, int64(0));
        if (responseCode != HederaResponseCodes.SUCCESS) revert BurnFailed(responseCode);
    }

    function safeAssociateTokens(address account, address[] memory tokens) internal {
        (bool success, bytes memory result) = PRECOMPILE_ADDRESS.call(
            abi.encodeWithSelector(IHederaTokenService.associateTokens.selector, account, tokens)
        );
        (bool htsSuccess, int32 responseCode) = tryDecodeSuccessResponseCode(success, result);
        if (!htsSuccess) revert MultipleAssociationsFailed(responseCode);
    }

    function safeAssociateToken(address token, address account) internal {
        (bool success, bytes memory result) =
            PRECOMPILE_ADDRESS.call(abi.encodeWithSelector(IHederaTokenService.associateToken.selector, account, token));
        (bool htsSuccess, int32 responseCode) = tryDecodeSuccessResponseCode(success, result);
        if (!htsSuccess) revert SingleAssociationFailed(responseCode);
    }

    function safeDissociateTokens(address account, address[] memory tokens) internal {
        (bool success, bytes memory result) = PRECOMPILE_ADDRESS.call(
            abi.encodeWithSelector(IHederaTokenService.dissociateTokens.selector, account, tokens)
        );
        (bool htsSuccess, int32 responseCode) = tryDecodeSuccessResponseCode(success, result);
        if (!htsSuccess) revert MultipleDissociationsFailed(responseCode);
    }

    function safeDissociateToken(address token, address account) internal {
        (bool success, bytes memory result) = PRECOMPILE_ADDRESS.call(
            abi.encodeWithSelector(IHederaTokenService.dissociateToken.selector, account, token)
        );
        (bool htsSuccess, int32 responseCode) = tryDecodeSuccessResponseCode(success, result);
        if (!htsSuccess) revert SingleDissociationFailed(responseCode);
    }

    function safeTransferTokens(address token, address[] memory accountIds, int64[] memory amounts) internal {
        (bool success, bytes memory result) = PRECOMPILE_ADDRESS.call(
            abi.encodeWithSelector(IHederaTokenService.transferTokens.selector, token, accountIds, amounts)
        );
        (bool htsSuccess, int32 responseCode) = tryDecodeSuccessResponseCode(success, result);
        if (!htsSuccess) revert TokensTransferFailed(responseCode);
    }

    /// forge-lint: disable-next-line(mixed-case-function)
    function safeTransferNFTs(
        address token,
        address[] memory sender,
        address[] memory receiver,
        int64[] memory serialNumber
    ) internal {
        (bool success, bytes memory result) = PRECOMPILE_ADDRESS.call(
            abi.encodeWithSelector(IHederaTokenService.transferNFTs.selector, token, sender, receiver, serialNumber)
        );
        (bool htsSuccess, int32 responseCode) = tryDecodeSuccessResponseCode(success, result);
        if (!htsSuccess) revert NFTsTransferFailed(responseCode);
    }

    function safeTransferToken(address token, address sender, address receiver, int64 amount) internal {
        (bool success, bytes memory result) = PRECOMPILE_ADDRESS.call(
            abi.encodeWithSelector(IHederaTokenService.transferToken.selector, token, sender, receiver, amount)
        );
        (bool htsSuccess, int32 responseCode) = tryDecodeSuccessResponseCode(success, result);
        if (!htsSuccess) revert TokenTransferFailed(responseCode);
    }

    function safeTransferFromToken(address token, address from, address to, int64 amount) internal {
        (bool success, bytes memory result) = PRECOMPILE_ADDRESS.call(
            abi.encodeWithSelector(IHederaTokenService.transferFrom.selector, token, from, to, amount)
        );
        (bool htsSuccess, int32 responseCode) = tryDecodeSuccessResponseCode(success, result);
        if (!htsSuccess) revert TokensTransferFromFailed(responseCode);
    }

    /// forge-lint: disable-next-line(mixed-case-function)
    function safeTransferNFT(address token, address sender, address receiver, int64 serialNumber) internal {
        (bool success, bytes memory result) = PRECOMPILE_ADDRESS.call(
            abi.encodeWithSelector(IHederaTokenService.transferNFT.selector, token, sender, receiver, serialNumber)
        );
        (bool htsSuccess, int32 responseCode) = tryDecodeSuccessResponseCode(success, result);
        if (!htsSuccess) revert NFTTransferFailed(responseCode);
    }

    function safeCreateFungibleToken(
        IHederaTokenService.HederaToken memory token,
        int64 initialTotalSupply,
        int32 decimals
    ) internal returns (address tokenAddress) {
        nonEmptyExpiry(token);
        (bool success, bytes memory result) = PRECOMPILE_ADDRESS.call{value: msg.value}(
            abi.encodeWithSelector(
                IHederaTokenService.createFungibleToken.selector, token, initialTotalSupply, decimals
            )
        );
        int32 responseCode;
        (responseCode, tokenAddress) =
            success ? abi.decode(result, (int32, address)) : (HederaResponseCodes.UNKNOWN, address(0));
        if (responseCode != HederaResponseCodes.SUCCESS) revert CreateFungibleTokenFailed(responseCode);
    }

    function safeCreateFungibleTokenWithCustomFees(
        IHederaTokenService.HederaToken memory token,
        int64 initialTotalSupply,
        int32 decimals,
        IHederaTokenService.FixedFee[] memory fixedFees,
        IHederaTokenService.FractionalFee[] memory fractionalFees
    ) internal returns (address tokenAddress) {
        nonEmptyExpiry(token);
        (bool success, bytes memory result) = PRECOMPILE_ADDRESS.call{value: msg.value}(
            abi.encodeWithSelector(
                IHederaTokenService.createFungibleTokenWithCustomFees.selector,
                token,
                initialTotalSupply,
                decimals,
                fixedFees,
                fractionalFees
            )
        );
        int32 responseCode;
        (responseCode, tokenAddress) =
            success ? abi.decode(result, (int32, address)) : (HederaResponseCodes.UNKNOWN, address(0));
        if (responseCode != HederaResponseCodes.SUCCESS) revert CreateFungibleTokenWithCustomFeesFailed(responseCode);
    }

    function safeCreateNonFungibleToken(IHederaTokenService.HederaToken memory token)
        internal
        returns (address tokenAddress)
    {
        nonEmptyExpiry(token);
        (bool success, bytes memory result) = PRECOMPILE_ADDRESS.call{value: msg.value}(
            abi.encodeWithSelector(IHederaTokenService.createNonFungibleToken.selector, token)
        );
        int32 responseCode;
        (responseCode, tokenAddress) =
            success ? abi.decode(result, (int32, address)) : (HederaResponseCodes.UNKNOWN, address(0));
        if (responseCode != HederaResponseCodes.SUCCESS) revert CreateNonFungibleTokenFailed(responseCode);
    }

    function safeCreateNonFungibleTokenWithCustomFees(
        IHederaTokenService.HederaToken memory token,
        IHederaTokenService.FixedFee[] memory fixedFees,
        IHederaTokenService.RoyaltyFee[] memory royaltyFees
    ) internal returns (address tokenAddress) {
        nonEmptyExpiry(token);
        (bool success, bytes memory result) = PRECOMPILE_ADDRESS.call{value: msg.value}(
            abi.encodeWithSelector(
                IHederaTokenService.createNonFungibleTokenWithCustomFees.selector, token, fixedFees, royaltyFees
            )
        );
        int32 responseCode;
        (responseCode, tokenAddress) =
            success ? abi.decode(result, (int32, address)) : (HederaResponseCodes.UNKNOWN, address(0));
        if (responseCode != HederaResponseCodes.SUCCESS) {
            revert CreateNonFungibleTokenWithCustomFeesFailed(responseCode);
        }
    }

    function safeApprove(address token, address spender, uint256 amount) internal {
        (bool success, bytes memory result) = PRECOMPILE_ADDRESS.call(
            abi.encodeWithSelector(IHederaTokenService.approve.selector, token, spender, amount)
        );
        (bool htsSuccess, int32 responseCode) = tryDecodeSuccessResponseCode(success, result);
        if (!htsSuccess) revert ApproveFailed(responseCode);
    }

    /// forge-lint: disable-next-line(mixed-case-function)
    function safeApproveNFT(address token, address approved, int64 serialNumber) internal {
        (bool success, bytes memory result) = PRECOMPILE_ADDRESS.call(
            abi.encodeWithSelector(IHederaTokenService.approveNFT.selector, token, approved, serialNumber)
        );
        (bool htsSuccess, int32 responseCode) = tryDecodeSuccessResponseCode(success, result);
        if (!htsSuccess) revert NFTApproveFailed(responseCode);
    }

    function safeSetApprovalForAll(address token, address operator, bool approved) internal {
        (bool success, bytes memory result) = PRECOMPILE_ADDRESS.call(
            abi.encodeWithSelector(IHederaTokenService.setApprovalForAll.selector, token, operator, approved)
        );
        (bool htsSuccess, int32 responseCode) = tryDecodeSuccessResponseCode(success, result);
        if (!htsSuccess) revert SetTokenApprovalForAllFailed(responseCode);
    }

    function safeDeleteToken(address token) internal {
        (bool success, bytes memory result) =
            PRECOMPILE_ADDRESS.call(abi.encodeWithSelector(IHederaTokenService.deleteToken.selector, token));
        (bool htsSuccess, int32 responseCode) = tryDecodeSuccessResponseCode(success, result);
        if (!htsSuccess) revert TokenDeleteFailed(responseCode);
    }

    function safeFreezeToken(address token, address account) internal {
        (bool success, bytes memory result) =
            PRECOMPILE_ADDRESS.call(abi.encodeWithSelector(IHederaTokenService.freezeToken.selector, token, account));
        (bool htsSuccess, int32 responseCode) = tryDecodeSuccessResponseCode(success, result);
        if (!htsSuccess) revert FreezeTokenFailed(responseCode);
    }

    function safeUnfreezeToken(address token, address account) internal {
        (bool success, bytes memory result) =
            PRECOMPILE_ADDRESS.call(abi.encodeWithSelector(IHederaTokenService.unfreezeToken.selector, token, account));
        (bool htsSuccess, int32 responseCode) = tryDecodeSuccessResponseCode(success, result);
        if (!htsSuccess) revert UnfreezeTokenFailed(responseCode);
    }

    function safeGrantTokenKyc(address token, address account) internal {
        (bool success, bytes memory result) =
            PRECOMPILE_ADDRESS.call(abi.encodeWithSelector(IHederaTokenService.grantTokenKyc.selector, token, account));
        (bool htsSuccess, int32 responseCode) = tryDecodeSuccessResponseCode(success, result);
        if (!htsSuccess) revert GrantTokenKYCFailed(responseCode);
    }

    function safeRevokeTokenKyc(address token, address account) internal {
        (bool success, bytes memory result) =
            PRECOMPILE_ADDRESS.call(abi.encodeWithSelector(IHederaTokenService.revokeTokenKyc.selector, token, account));
        (bool htsSuccess, int32 responseCode) = tryDecodeSuccessResponseCode(success, result);
        if (!htsSuccess) revert RevokeTokenKYCFailed(responseCode);
    }

    function safePauseToken(address token) internal {
        (bool success, bytes memory result) =
            PRECOMPILE_ADDRESS.call(abi.encodeWithSelector(IHederaTokenService.pauseToken.selector, token));
        (bool htsSuccess, int32 responseCode) = tryDecodeSuccessResponseCode(success, result);
        if (!htsSuccess) revert PauseTokenFailed(responseCode);
    }

    function safeUnpauseToken(address token) internal {
        (bool success, bytes memory result) =
            PRECOMPILE_ADDRESS.call(abi.encodeWithSelector(IHederaTokenService.unpauseToken.selector, token));
        (bool htsSuccess, int32 responseCode) = tryDecodeSuccessResponseCode(success, result);
        if (!htsSuccess) revert UnpauseTokenFailed(responseCode);
    }

    function safeWipeTokenAccount(address token, address account, int64 amount) internal {
        (bool success, bytes memory result) = PRECOMPILE_ADDRESS.call(
            abi.encodeWithSelector(IHederaTokenService.wipeTokenAccount.selector, token, account, amount)
        );
        (bool htsSuccess, int32 responseCode) = tryDecodeSuccessResponseCode(success, result);
        if (!htsSuccess) revert WipeTokenAccountFailed(responseCode);
    }

    /// forge-lint: disable-next-line(mixed-case-function)
    function safeWipeTokenAccountNFT(address token, address account, int64[] memory serialNumbers) internal {
        (bool success, bytes memory result) = PRECOMPILE_ADDRESS.call(
            abi.encodeWithSelector(IHederaTokenService.wipeTokenAccountNFT.selector, token, account, serialNumbers)
        );
        (bool htsSuccess, int32 responseCode) = tryDecodeSuccessResponseCode(success, result);
        if (!htsSuccess) revert WipeTokenAccountNFTFailed(responseCode);
    }

    function safeUpdateTokenInfo(address token, IHederaTokenService.HederaToken memory tokenInfo) internal {
        nonEmptyExpiry(tokenInfo);
        (bool success, bytes memory result) = PRECOMPILE_ADDRESS.call(
            abi.encodeWithSelector(IHederaTokenService.updateTokenInfo.selector, token, tokenInfo)
        );
        (bool htsSuccess, int32 responseCode) = tryDecodeSuccessResponseCode(success, result);
        if (!htsSuccess) revert UpdateTokenInfoFailed(responseCode);
    }

    function safeUpdateTokenExpiryInfo(address token, IHederaTokenService.Expiry memory expiryInfo) internal {
        (bool success, bytes memory result) = PRECOMPILE_ADDRESS.call(
            abi.encodeWithSelector(IHederaTokenService.updateTokenExpiryInfo.selector, token, expiryInfo)
        );
        (bool htsSuccess, int32 responseCode) = tryDecodeSuccessResponseCode(success, result);
        if (!htsSuccess) revert UpdateTokenExpiryInfoFailed(responseCode);
    }

    function safeUpdateTokenKeys(address token, IHederaTokenService.TokenKey[] memory keys) internal {
        (bool success, bytes memory result) =
            PRECOMPILE_ADDRESS.call(abi.encodeWithSelector(IHederaTokenService.updateTokenKeys.selector, token, keys));
        (bool htsSuccess, int32 responseCode) = tryDecodeSuccessResponseCode(success, result);
        if (!htsSuccess) revert UpdateTokenKeysFailed(responseCode);
    }

    function safeUpdateFungibleTokenCustomFees(
        address token,
        IHederaTokenService.FixedFee[] memory fixedFees,
        IHederaTokenService.FractionalFee[] memory fractionalFees
    ) internal {
        (bool success, bytes memory result) = PRECOMPILE_ADDRESS.call(
            abi.encodeWithSelector(
                IHederaTokenService.updateFungibleTokenCustomFees.selector, token, fixedFees, fractionalFees
            )
        );
        (bool htsSuccess, int32 responseCode) = tryDecodeSuccessResponseCode(success, result);
        if (!htsSuccess) revert UpdateTokenCustomFeesFailed(responseCode);
    }

    function tryDecodeSuccessResponseCode(bool _success, bytes memory _result)
        private
        pure
        returns (bool success_, int32 responseCode_)
    {
        responseCode_ = abi.decode(_result, (int32));
        success_ = (_success ? responseCode_ : HederaResponseCodes.UNKNOWN) == HederaResponseCodes.SUCCESS;
    }

    function nonEmptyExpiry(IHederaTokenService.HederaToken memory token) private view {
        if (token.expiry.second == 0 && token.expiry.autoRenewPeriod == 0) {
            token.expiry.autoRenewPeriod = DEFAULT_AUTO_RENEW_PERIOD;
            token.expiry.autoRenewAccount = address(this);
        }
    }
}
