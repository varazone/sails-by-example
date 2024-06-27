use gstd::{debug, format, Decode, Encode, String, Vec};
use sails_rtl::gstd::gservice;
use sails_rtl::Box;

pub struct Service;

#[gservice]
impl Service {
    pub const fn new() -> Self {
        Self
    }

    pub async fn ping(&mut self) -> bool {
        debug!("Ping called");
        true
    }
}
