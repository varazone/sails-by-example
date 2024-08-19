#![no_std]
use gstd::{exec, msg};
use sails_rs::collections::HashMap;
use sails_rs::prelude::*;

#[derive(Clone, PartialEq, Debug)]
pub struct Storage {
    admin: ActorId,
    players: Vec<ActorId>,
    config: Option<Config>,
    winners: HashMap<ActorId, u128>,
    status: Status,
    pooled: u128,
}

#[derive(Clone, PartialEq, Debug, Encode, Decode, TypeInfo)]
pub struct GameState {
    admin: ActorId,
    players: Vec<ActorId>,
    config: Option<Config>,
    winners: Vec<(ActorId, u128)>,
    status: Status,
}

impl From<Storage> for GameState {
    fn from(storage: Storage) -> Self {
        GameState {
            admin: storage.admin,
            players: storage.players,
            config: storage.config,
            winners: storage.winners.into_iter().collect(),
            status: storage.status,
        }
    }
}

#[derive(Copy, Clone, PartialEq, Debug, Encode, Decode, TypeInfo)]
pub struct Config {
    per_share: u128,
    max_share: u32,
    // commission_percent: u8;
}

#[derive(Copy, Clone, PartialEq, Debug, Encode, Decode, TypeInfo)]
pub enum Status {
    Idle,
    OnGoing,
    Completed,
}

static mut STORAGE: Option<Storage> = None;

impl Storage {
    pub fn get() -> &'static Self {
        unsafe { STORAGE.as_ref().expect("Storage is not initialized") }
    }
    pub fn get_mut() -> &'static mut Self {
        unsafe { STORAGE.as_mut().expect("Storage is not initialized") }
    }
}

#[derive(Encode, Decode, TypeInfo, Debug)]
pub enum Event {
    Started {
        config: Config,
    },
    Deposited {
        who: ActorId,
        index: u32,
        target: u32,
    },
    Completed,
    // Debug(ActorId, u128, u128),
}

#[derive(Default)]
pub struct LuckyDraw;

#[service(events = Event)]
impl LuckyDraw {
    pub fn init() {
        unsafe {
            STORAGE = Some(Storage {
                admin: msg::source(),
                config: None,
                players: vec![],
                winners: Default::default(),
                status: Status::Idle,
                pooled: 0,
            })
        }
    }

    pub fn terminate(&mut self) {
        let storage = Storage::get();
        assert_eq!(msg::source(), storage.admin, "sender must be admin");
        exec::exit(storage.admin);
    }

    pub fn start_game(&mut self, per_share: u128, max_share: u32) {
        let storage = Storage::get_mut();
        assert_eq!(msg::source(), storage.admin, "sender must be admin");
        assert!(
            !matches!(storage.status, Status::OnGoing { .. }),
            "cannot start while game is on-going"
        );
        assert_ne!(per_share, 0, "per_share cannot be zero");
        assert_ne!(max_share, 0, "max_share cannot be zero");

        let config = Config {
            per_share,
            max_share,
        };
        storage.config = Some(config);
        // storage.winners = Default::default();
        storage.players = vec![];
        storage.status = Status::OnGoing;
        storage.pooled = 0;

        let _ = self.notify_on(Event::Started { config });
    }

    fn settle(&mut self) {
        let storage = Storage::get_mut();
        // assert vec len == max_share
        assert!(
            matches!(storage.status, Status::OnGoing { .. }),
            "game must be on-going"
        );
        let config = storage.config.unwrap();
        assert_eq!(
            storage.players.len() as u32,
            config.max_share,
            "player count must reach max_share"
        );

        // distribute rewards
        // let winner = pick_winner(&storage.players);
        let winner = pick_random(&storage.players).unwrap();
        // let amount = storage.players.len() * ;
        // set winner
        // storage.winner = Some((*winner, amount));
        storage
            .winners
            .entry(*winner)
            .and_modify(|value| *value += storage.pooled)
            .or_insert(storage.pooled);
        // if let Some(value) = storage.winners.get(winner) {
        //     // *value += storage.pooled;
        //     // self.debug(format!("insert {}: {} + {}", winner, *value, storage.pooled));
        //     let _ = self.notify_on(Event::Debug(*winner, *value, storage.pooled));
        //     storage.winners.insert(*winner, *value + storage.pooled);
        // } else {
        //     let _ = self.notify_on(Event::Debug(*winner, 1, storage.pooled));
        //     storage.winners.insert(*winner, storage.pooled);
        //     // self.debug(format!("insert {}: {}", *winner, storage.pooled));
        // }
        // reset config
        storage.config = None;
        storage.players = vec![];
        storage.status = Status::Completed;
        storage.pooled = 0;

        let _ = self.notify_on(Event::Completed);
    }

    pub fn draw(&mut self) {
        let storage = Storage::get_mut();
        let config = storage.config.unwrap();
        let value = msg::value();
        let who = msg::source();
        assert_eq!(
            value, config.per_share,
            "value must be {}, got {}",
            config.per_share, value
        );

        match storage.status {
            Status::OnGoing => {
                storage.players.push(who);
                storage.pooled += value;
                let index = storage.players.len() as u32;
                let target = config.max_share;
                let _ = self.notify_on(Event::Deposited { who, index, target });

                if storage.players.len() as u32 >= config.max_share {
                    self.settle()
                }
            }
            _ => panic!("Game status must be on-going"),
        }
    }

    pub fn claim(&mut self) -> MessageId {
        let storage = Storage::get_mut();
        let sender = msg::source();
        match storage.winners.remove(&sender) {
            Some(value) => {
                let gas_limit: u64 = 60 * 60 * 24 / 3 * 100; // 60 * 60 * 24 / 3 sec per block * 100 gas per block = 2_880_000;
                let msg_id = msg::send_bytes_with_gas(
                    sender,
                    b"CONGRATS! Please claim the reward in 24 hours!",
                    gas_limit,
                    value,
                )
                .expect("failed to claim");
                msg_id
            }
            _ => {
                panic!("nothing to claim");
            }
        }
    }

    pub fn game_state(&self) -> GameState {
        let storage = Storage::get();
        storage.clone().into()
    }
}

pub fn get_random_u32() -> u32 {
    let salt = msg::id();
    let (hash, _num) = exec::random(salt.into()).expect("get*random_u32(): random call failed");
    u32::from_le_bytes([hash[0], hash[1], hash[2], hash[3]])
}

pub fn pick_random<T>(vec: &Vec<T>) -> Option<&T> {
    if vec.is_empty() {
        None
    } else {
        let random_u32 = get_random_u32();
        let index = random_u32 as usize % vec.len();
        Some(&vec[index])
    }
}

#[derive(Default)]
pub struct Program;

#[program]
impl Program {
    pub fn new() -> Self {
        LuckyDraw::init();
        Self
    }

    pub fn lucky_draw(&self) -> LuckyDraw {
        LuckyDraw::default()
    }
}
