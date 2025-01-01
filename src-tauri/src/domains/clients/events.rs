// Nested procedures, you can also do this (path = "api.events.users")
#[taurpc::procedures(path = "events")]
trait ClientEvents {
    #[taurpc(event)]
    async fn event();
}

#[derive(Clone)]
struct ClientEventsImpl;

#[taurpc::resolvers]
impl ClientEvents for ClientEventsImpl {}
