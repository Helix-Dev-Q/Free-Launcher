#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::fs::create_dir_all;
use sysinfo::System;
use tauri::{AppHandle, Manager, Window};
mod carter;
use dotenvy::dotenv;

#[tauri::command]
fn close_launcher(app: tauri::AppHandle) {
    app.exit(0);
}

#[tauri::command]
fn window_minimize(window: Window) {
    window.minimize().unwrap();
}

#[tauri::command]
async fn firstlaunch(
    path: String,
    app: AppHandle,
    email: String,
    password: String,
) -> Result<bool, String> {
    carter::kill();
    carter::kill_epic();

    let dll_url = std::env::var("NEXT_PUBLIC_LAUNCHER_REDIRECT_DOWNLOAD").unwrap_or_default();

    carter::launch_fn(&path, dll_url, app, email, password).await
}

#[tauri::command]
fn window_close(window: Window) {
    window.close().unwrap();
}

fn main() {
    dotenv().ok();
    let app_name = "Project";
    let path = format!("C:\\Program Files\\{}", app_name);

    if let Err(e) = create_dir_all(&path) {
        eprintln!("Error creating folder: {}", e);
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_notification::init())
        .setup(|app| {
            if let Ok(env_content) = std::fs::read_to_string("../../.env") {
                for line in env_content.lines() {
                    if line.starts_with('#') || line.trim().is_empty() { continue; }
                    if let Some((key, value)) = line.split_once('=') {
                        let clean_value = value.trim().trim_matches('"').to_string();
                        std::env::set_var(key.trim(), clean_value);
                    }
                }
            }

            if let Some(window) = app.get_window("main") {
                window.on_window_event(|event| {
                    if let tauri::WindowEvent::CloseRequested { .. } = event {
                        carter::kill();
                    }
                });
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            window_minimize,
            window_close,
            firstlaunch,
            is_fortnite_client_running,
            close_launcher,
            carter::get_or_create_license_id,
            check_build,
            exists
        ])
        .run(tauri::generate_context!())
        .expect("Fehler beim Start der App");
}

#[tauri::command]
fn is_fortnite_client_running() -> bool {
    let mut system = System::new_all();
    system.refresh_all();
    for (_, process) in system.processes() {
        if process.name().to_string().contains("FortniteClient-Win64-Shipping.exe") {
            return true;
        }
    }
    false
}

#[tauri::command]
async fn check_build(path: String) -> Result<Vec<String>, String> {
    use std::fs::File;
    use std::io::Read;

    let mut file = File::open(&path).map_err(|e| e.to_string())?;
    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer).map_err(|e| e.to_string())?;

    let content = String::from_utf8_lossy(&buffer);
    let lines = content
        .lines()
        .filter(|l| l.contains("Fortnite") && (l.contains("Release") || l.contains("Cert")))
        .map(|l| l.to_string())
        .collect();

    Ok(lines)
}

#[tauri::command]
async fn exists(path: String) -> Result<bool, String> {
    Ok(std::path::Path::new(&path).exists())
}
