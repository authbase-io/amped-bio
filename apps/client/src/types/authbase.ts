export type AuthbaseStatus = "NOT_LINKED" | "NOT_VERIFIED" | "VERIFIED" | "VERIFIED_WITH_BADGE";

export type AuthbaseTier = "STANDARD" | "ENHANCED";

export interface AuthbaseVerification {
  type: AuthbaseTier;
  verified_at: string;
  valid_until: string;
}

export interface AuthbaseBadge {
  tier: AuthbaseTier;
  // uint256 string — never coerce with Number()
  token_id: string;
  transaction_hash: string;
  minted_at: string;
}

interface AuthbaseBase {
  wallet_address: string;
  message: string;
  // Backend-derived. `verified` already folds in the `valid_until > now`
  // check, so an expired attestation returns verified:false even though
  // `status` is still VERIFIED / VERIFIED_WITH_BADGE. Always render off these
  // two booleans, never off the raw `status` string.
  verified: boolean;
  hasBadge: boolean;
  // Consent-filtered PII. Only keys the holder chose to share are present;
  // {} when nothing is shared or the wallet isn't linked. Independent of
  // verification status — render whatever keys exist. Absent ≠ denied.
  attributes: Record<string, string>;
}

export type AuthbaseWalletStatus =
  | (AuthbaseBase & {
      status: "NOT_LINKED";
      authbase_wallet_address: null;
      verification: null;
      badge: null;
    })
  | (AuthbaseBase & {
      status: "NOT_VERIFIED";
      authbase_wallet_address: string;
      verification: null;
      badge: null;
    })
  | (AuthbaseBase & {
      status: "VERIFIED";
      authbase_wallet_address: string;
      verification: AuthbaseVerification;
      badge: null;
    })
  | (AuthbaseBase & {
      status: "VERIFIED_WITH_BADGE";
      authbase_wallet_address: string;
      verification: AuthbaseVerification;
      badge: AuthbaseBadge;
    });
