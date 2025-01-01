#[cfg_attr(mobile, tauri::mobile_entry_point)]
use taurpc::Router;
mod domains;
mod db;
mod schema;
use domains::clients::commands::{ClientCommandsImpl, ClientCommands};

pub fn run() {
    let router = Router::new()
        .export_config(
            specta_typescript::Typescript::default()
                .remove_default_header()
                .header("/* eslint-disable eslint-comments/no-unlimited-disable */\n/* eslint-disable */\n// FILE AUTOGENERATED BY Specta. DO NOT EDIT.\n")
        )
        .merge(ClientCommandsImpl.into_handler());

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(router.into_handler())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}