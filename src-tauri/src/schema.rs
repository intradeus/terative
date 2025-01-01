diesel::table! {
    clients (id) {
        id -> Text,
        first_name -> Text,
        last_name -> Text,
        email-> Text,
        phone-> Text,
        address-> Text,
        birth_date->Timestamp,
        sex-> Text
    }
}

diesel::table! {
    client_comments (id) {
        id -> Text,
        client_id -> Text,
        comment -> Text,
        content -> Text,
        role -> Text,
        finish_reason -> Text,
        prompt_tokens -> Integer,
        completion_tokens -> Integer,
        created_at -> Timestamp,
        updated_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    client_comment_documents (id) {
        id -> Text,
        client_comment_id -> Text,
        original_name -> Text,
        extension -> Nullable<Text>,
    }
}

diesel::joinable!(client_comments -> clients (client_id));
diesel::joinable!(client_comment_documents -> client_comments (client_comment_id));
diesel::allow_tables_to_appear_in_same_query!(clients, client_comments, client_comment_documents);
