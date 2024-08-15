use counter_with_event_app::Program;
use sails_client_gen::ClientGenerator;
use sails_idl_gen::program;
use std::{env, path::PathBuf};

fn main() {
    let idl_file_path =
        PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap()).join("counter_with_event.idl");

    // Generate IDL file for the `Demo` app
    program::generate_idl_to_file::<Program>(&idl_file_path).unwrap();

    let client_file_path = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap())
        .join("src/counter_with_event_client.rs");

    // Generate client code from IDL file
    ClientGenerator::from_idl_path(&idl_file_path)
        .with_mocks("with_mocks")
        .generate_to(&client_file_path)
        .unwrap();
}
