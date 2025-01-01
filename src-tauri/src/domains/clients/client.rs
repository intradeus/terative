use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[taurpc::ipc_type]
struct ClientDocument {
    id: Uuid,
    original_name: String,
    extension: String,
}

#[taurpc::ipc_type]
struct ClientComment {
    id: Uuid,
    comment: String,
    created_at: DateTime<Utc>,
    updated_at: Option<DateTime<Utc>>,
    documents: Vec<ClientDocument>,
}

#[taurpc::ipc_type]
pub struct ClientMutableProps {
    first_name: String,
    last_name: String,
    email: Option<String>,
    phone: Option<String>,
    address: Option<String>,
    birth_date: Option<DateTime<Utc>>,
    sex: String,
}

#[taurpc::ipc_type]
pub struct Client {
    pub id: Uuid,
    pub first_name: String,
    pub last_name: String,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub address: Option<String>,
    pub birth_date: Option<DateTime<Utc>>,
    pub sex: String,
    pub comments: Vec<ClientComment>,
}

impl Client {
    pub fn new(props: ClientMutableProps) -> Client {
        Client {
            id: Uuid::new_v4(),
            first_name: props.first_name,
            last_name: props.last_name,
            email: props.email,
            phone: props.phone,
            address: props.address,
            birth_date: props.birth_date,
            sex: props.sex,
            comments: vec![],
        }
    }

    pub fn edit(
        &mut self,
        first_name: String,
        last_name: String,
        email: Option<String>,
        phone: Option<String>,
        address: Option<String>,
    ) {
        self.first_name = first_name;
        self.last_name = last_name;
        self.email = email;
        self.phone = phone;
        self.address = address;
    }

    pub fn add_comment(&mut self, comment: String, documents: Vec<ClientDocument>) {
        self.comments.push(ClientComment {
            id: Uuid::new_v4(),
            comment,
            documents,
            created_at: Utc::now(),
            updated_at: Some(Utc::now()),
        });
    }

    pub fn edit_comment(&mut self, comment_id: Uuid, new_comment: String) {
        let comment = self.comments.iter_mut().find(|c| c.id == comment_id);
        if let Some(comment) = comment {
            comment.comment = new_comment;
            comment.updated_at = Some(Utc::now());
        } else {
            panic!("Comment not found");
        }
    }
}
