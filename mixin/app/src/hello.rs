use sails_rs::prelude::*;

#[derive(Clone, Default)]
pub struct HelloWorld;

#[service]
impl HelloWorld {
    pub fn say_hello(&mut self) -> &'static str {
        "Hello!"
    }

    pub fn greet(&mut self, name: String) -> String {
        format!("Hello, {name}!")
    }
}
