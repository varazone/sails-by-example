use lesson_02_part_03_app::Program;
use sails_idl_gen::program;
use std::{env, path::PathBuf};

fn main() {
    gear_wasm_builder::build();

    program::generate_idl_to_file::<Program>(
        PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap()).join("lesson_02_part_03.idl"),
    )
    .unwrap();
}
