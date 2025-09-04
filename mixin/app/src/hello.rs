use sails_rs::prelude::*;

#[derive(Clone, Default)]
pub struct HelloWorld;

#[service]
impl HelloWorld {
    #[export]
    pub fn say_hello(&mut self) -> &'static str {
        "Hello!"
    }

    #[export]
    pub fn greet(&mut self, name: String) -> String {
        format!("Hello, {name}!")
    }
}
