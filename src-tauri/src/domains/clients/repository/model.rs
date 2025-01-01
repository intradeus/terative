
use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::Serialize;
use crate::schema::{clients,client_comment_documents,client_comments};

#[derive(Queryable, Serialize, Insertable, Identifiable, Selectable, Debug, PartialEq)]
#[diesel(table_name = clients)]
pub struct Client {
    pub id: String,
    pub first_name: String,
    pub last_name: String,
    pub email: String,
    pub phone: String,
    pub address: String,
    pub birth_date: NaiveDateTime,
    pub sex: String
}

#[derive(Queryable, Serialize, Insertable, Identifiable, Selectable, Associations, Debug, PartialEq)]
#[diesel(belongs_to(Client))]
#[diesel(table_name = client_comments)]
pub struct ClientComment {
    pub id: String,
    pub comment: String,
    pub created_at: NaiveDateTime,
    pub updated_at: Option<NaiveDateTime>,
    pub client_id: String
}

#[derive(Queryable, Serialize, Insertable, Identifiable, Selectable, Associations, Debug, PartialEq)]
#[diesel(belongs_to(ClientComment))]
#[diesel(table_name = client_comment_documents)]
pub struct ClientCommentDocument {
    pub id: String,
    pub original_name: String,
    pub extension: String,
    pub client_comment_id: String
}
