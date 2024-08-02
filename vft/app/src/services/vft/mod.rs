use gstd::{collections::HashMap, format, msg, Decode, Encode, String, TypeInfo, Vec};
use sails_rs::prelude::*;

pub use utils::*;

pub mod funcs;
pub(crate) mod utils;

static mut STORAGE: Option<Storage> = None;

#[derive(Debug, Default)]
struct Storage {
    balances: HashMap<ActorId, U256>,
    allowances: HashMap<(ActorId, ActorId), U256>,
    meta: Metadata,
    total_supply: U256,
}

impl Storage {
    pub fn get_mut() -> &'static mut Self {
        unsafe { STORAGE.as_mut().expect("Storage is not initialized") }
    }
    pub fn get() -> &'static Self {
        unsafe { STORAGE.as_ref().expect("Storage is not initialized") }
    }
}

#[derive(Debug, Default)]
pub struct Metadata {
    pub name: String,
    pub symbol: String,
    pub decimals: u8,
}

#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord, Encode, Decode, TypeInfo)]
pub enum Event {
    Approval {
        owner: ActorId,
        spender: ActorId,
        value: U256,
    },
    Transfer {
        from: ActorId,
        to: ActorId,
        value: U256,
    },
}

#[derive(Clone)]
pub struct Service();

impl Service {
    pub fn seed(name: String, symbol: String, decimals: u8) -> Self {
        unsafe {
            STORAGE = Some(Storage {
                meta: Metadata {
                    name,
                    symbol,
                    decimals,
                },
                ..Default::default()
            });
        }
        Self()
    }
}

#[service(events = Event)]
impl Service {
    pub fn new() -> Self {
        Self()
    }

    pub fn approve(&mut self, spender: ActorId, value: U256) -> bool {
        let owner = msg::source();
        let storage = Storage::get_mut();
        let mutated = funcs::approve(&mut storage.allowances, owner, spender.into(), value);

        if mutated {
            let _ = self.notify_on(Event::Approval {
                owner: owner.into(),
                spender,
                value,
            });
        }

        mutated
    }

    pub fn transfer(&mut self, to: ActorId, value: U256) -> bool {
        let from = msg::source();
        let storage = Storage::get_mut();
        let mutated =
            panicking(move || funcs::transfer(&mut storage.balances, from, to.into(), value));

        if mutated {
            let _ = self.notify_on(Event::Transfer {
                from: from.into(),
                to,
                value,
            });
        }

        mutated
    }

    pub fn transfer_from(&mut self, from: ActorId, to: ActorId, value: U256) -> bool {
        let spender = msg::source();
        let storage = Storage::get_mut();
        let mutated = panicking(move || {
            funcs::transfer_from(
                &mut storage.allowances,
                &mut storage.balances,
                spender,
                from.into(),
                to.into(),
                value,
            )
        });

        if mutated {
            let _ = self.notify_on(Event::Transfer { from, to, value });
        }

        mutated
    }

    pub fn allowance(&self, owner: ActorId, spender: ActorId) -> U256 {
        let storage = Storage::get();
        funcs::allowance(&storage.allowances, owner.into(), spender.into())
    }

    pub fn balance_of(&self, account: ActorId) -> U256 {
        let storage = Storage::get();
        funcs::balance_of(&storage.balances, account.into())
    }

    pub fn decimals(&self) -> &'static u8 {
        let storage = Storage::get();
        &storage.meta.decimals
    }

    pub fn name(&self) -> &'static str {
        let storage = Storage::get();
        &storage.meta.name
    }

    pub fn symbol(&self) -> &'static str {
        let storage = Storage::get();
        &storage.meta.symbol
    }

    pub fn total_supply(&self) -> &'static U256 {
        let storage = Storage::get();
        &storage.total_supply
    }
}
