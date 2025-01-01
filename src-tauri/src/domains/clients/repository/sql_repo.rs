use uuid::Uuid;
use crate::schema::clients;

use crate::{
    db::establish_db_connection,
    domains::clients::client::Client
};

pub trait ClientRepository {
    async fn save(client: Client);
    async fn get(id: Uuid) -> Option<Client>;
    async fn get_all() -> Vec<Client>;
}

#[derive(Debug)]
pub struct ClientSqliteRepository;

impl ClientRepository for ClientSqliteRepository {

    async fn save(client: Client) {
        // Save client to sqlite
        let connection = &mut establish_db_connection();

        diesel::insert_into(clients::table)
            .values(client)
            .execute(connection)
            .expect("Error saving new client");
    }

    async fn get(id: Uuid) -> Option<Client> {
        // Get client from sqlite
        None
    }

    async fn get_all() -> Vec<Client> {
        // Get all clients from sqlite
        vec![]
    }
}
