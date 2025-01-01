// import client from client.rs file next to this file
use crate::domains::clients::client::{Client,ClientMutableProps};

#[taurpc::procedures]
pub trait ClientCommands {
    async fn hello_world();
    async fn add_client(client: ClientMutableProps);
}

#[derive(Clone)]
pub struct ClientCommandsImpl;

#[taurpc::resolvers]
impl ClientCommands for ClientCommandsImpl {
    async fn hello_world(self) {
        println!("Hello world");
    }

    async fn add_client(self, client: ClientMutableProps) {
        let new_client = Client::new(client);

    }
}
