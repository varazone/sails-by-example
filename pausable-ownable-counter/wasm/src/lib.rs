#![no_std]
include!(concat!(env!("OUT_DIR"), "/wasm_binary.rs"));

#[cfg(target_arch = "wasm32")]
pub use pausable_ownable_counter_app::wasm::*;
