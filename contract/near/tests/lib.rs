use near_sdk::{testing_env, test_utils::VMContextBuilder, AccountId, NearToken};
use near_sdk::test_utils::accounts;
use soulpr_near::SoulPR;

fn context(predecessor: AccountId) -> near_sdk::VMContext {
    VMContextBuilder::new()
        .predecessor_account_id(predecessor)
        .attached_deposit(NearToken::from_near(1))
        .build()
}

#[test]
fn backend_can_mint_and_duplicate_is_rejected() {
    let owner = accounts(0);
    let backend = accounts(1);
    let contributor = accounts(2);
    testing_env!(context(owner.clone()));
    let mut contract = SoulPR::init(owner, backend.clone());

    testing_env!(context(backend));
    assert_eq!(contract.mint(contributor.clone(), "org/repo".into(), 1, "Fix".into(), "alice".into(), "abc".into(), 1), 1);
    assert!(contract.is_minted("org/repo".into(), 1, contributor.clone(), "abc".into()));
    assert_eq!(contract.nft_tokens_by_owner(contributor), vec![1]);
}

#[test]
#[should_panic(expected = "ERR_NOT_BACKEND_MINTER")]
fn non_backend_cannot_mint() {
    let owner = accounts(0);
    let backend = accounts(1);
    testing_env!(context(owner.clone()));
    let mut contract = SoulPR::init(owner, backend);
    testing_env!(context(accounts(2)));
    contract.mint(accounts(3), "org/repo".into(), 1, "Fix".into(), "alice".into(), "abc".into(), 1);
}