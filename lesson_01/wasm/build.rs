use lesson_01_app::Program;
use sails_idl_gen::program;
use std::{env, path::PathBuf};

fn main() {
    gear_wasm_builder::build();

    program::generate_idl_to_file::<Program>(
        PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap()).join("lesson_01.idl"),
    )
    .unwrap();
}
