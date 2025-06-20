use axum::Router;
use axum::routing::get;

#[tokio::main]
async fn main() {
    let routes_root = Router::new().route(
        "/root",
        get(|| async {"Beginning of rust server"}),
    );
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener,routes_root).await.unwrap();
}
