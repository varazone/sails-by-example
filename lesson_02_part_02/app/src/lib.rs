#![no_std]
use sails_rs::collections::HashMap;
use sails_rs::prelude::*;

pub struct Storage {
    name: String,
    balances: HashMap<ActorId, U256>,
}

static mut STORAGE: Option<Storage> = None;

impl Storage {
    pub fn get() -> &'static Self {
	#[allow(static_mut_refs)]
        unsafe { STORAGE.as_ref().expect("Storage is not initialized") }
    }
    pub fn get_mut() -> &'static mut Self {
	#[allow(static_mut_refs)]
        unsafe { STORAGE.as_mut().expect("Storage is not initialized") }
    }
}

#[derive(Default)]
pub struct Token;

#[service]
impl Token {
    pub fn init(name: String) {
        unsafe {
            STORAGE = Some(Storage {
                name,
                balances: HashMap::new(),
            });
        }
    }

    pub fn name(&self) -> &'static str {
        let storage = Storage::get();
        &storage.name
    }

    pub fn mint(&mut self, to: ActorId, amount: U256) {
        let storage = Storage::get_mut();
        let balance = storage.balances.entry(to).or_insert(U256::zero());
        *balance += amount;
    }

    pub fn balance_of(&self, account: ActorId) -> U256 {
        let storage = Storage::get();
        *storage.balances.get(&account).unwrap_or(&U256::zero())
    }
}

#[derive(Default)]
pub struct Program;

#[program]
impl Program {
    pub fn new(name: String) -> Self {
        Token::init(name);
        Self
    }

    pub fn token(&self) -> Token {
        Token::default()
    }
}
