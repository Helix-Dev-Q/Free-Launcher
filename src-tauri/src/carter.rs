use std::env;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};
use uuid::Uuid;
use std::fs;
use std::io::Write;
use std::process::{Command, Stdio};
use std::path::Path;



#[tauri::command]
pub fn get_or_create_license_id(app: AppHandle) -> Result<String, String> {
    let app_dir: PathBuf = app
        .path()
        .app_config_dir()
        .map_err(|e| format!("could not get app_config_dir: {:?}", e))?;
    let id_file = app_dir.join("launcher_license_id.txt");

    if id_file.exists() {
        let s = std::fs::read_to_string(&id_file).map_err(|e| e.to_string())?;
        return Ok(s);
    }

    let uuid = Uuid::new_v4().to_string();
    std::fs::create_dir_all(&app_dir).map_err(|e| e.to_string())?;
    std::fs::write(&id_file, &uuid).map_err(|e| e.to_string())?;
    Ok(uuid)
}

#[allow(dead_code)]
pub fn kill() {
    let processes = [
        "FortniteLauncher.exe",
        "FortniteClient-Win64-Shipping.exe",
        "FortniteClient-Win64-Shipping_BE.exe",
        "EasyAntiCheat_EOS.exe",
    ];
    
    for proc in processes {
        let _ = Command::new("taskkill")
            .args(["/F", "/IM", proc])
            .stdout(Stdio::null())
            .stderr(Stdio::null())
            .spawn();
    }
}

#[allow(dead_code)]
pub fn kill_epic() {
    let processes = [
        "EpicGamesLauncher.exe",
        "EpicWebHelper.exe",
    ];
    
    for proc in processes {
        let _ = Command::new("taskkill")
            .args(["/F", "/IM", proc])
            .stdout(Stdio::null())
            .stderr(Stdio::null())
            .spawn();
    }
}

#[allow(dead_code)]
#[tauri::command]
pub async fn download_paks_cmd(url: String, dest: String) -> Result<bool, String> {
    let response = reqwest::blocking::get(&url).map_err(|e| e.to_string())?;
    let dest_path = PathBuf::from(dest);
    
    if let Some(parent) = dest_path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    
    let mut file = fs::File::create(&dest_path).map_err(|e| e.to_string())?;
    let content = response.bytes().map_err(|e| e.to_string())?;
    file.write_all(&content[..]).map_err(|e| e.to_string())?;
    
    Ok(true)
}

#[allow(dead_code)]
pub async fn launch_fn(
    path: &str,
    dll_url: String,
    _app: AppHandle,
    email: String,
    password: String,
) -> Result<bool, String> {
    let game_path = PathBuf::from(path);
    let game_game_directory: &Path = game_path
        .parent()
        .ok_or("Failed to get parent directory")?
        .parent()
        .ok_or("Failed to get FortniteGame directory")?;

    let game_dll_path = dll_path(game_game_directory);

    if game_dll_path.exists() {
        if let Err(err) = remove_dll(game_game_directory) {
            return Err(format!("Failed to remove game DLL: {}", err));
        }
    }

    if !dll_url.is_empty() {
        if let Err(err) = download(&dll_url, &game_dll_path) {
            return Err(format!("Failed to download game DLL: {}", err));
        }
    }

    let cwd = game_game_directory.join("Win64");
    let fn_shipping = cwd.join("FortniteClient-Win64-Shipping.exe");

    if !game_dll_path.exists() && !dll_url.is_empty() {
        return Err("Failed to find Redirect (game DLL)".to_string());
    }

    let e_arg = format!("-AUTH_LOGIN={}", email);
    let p_arg = format!("-AUTH_PASSWORD={}", password);

    let combined_args = vec![
        "-epicapp=Fortnite",
        "-epicenv=Prod",
        "-epiclocale=en-us",
        "-epicportal",
        "-nobe",
        "-fromfl=eac",
        "-nocodeguards",
        "-nouac",
        "-fltoken=3db3ba5dcbd2e16703f3978d",
        "-caldera=eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiYmU5ZGE1YzJmYmVhNDQwN2IyZjQwZWJhYWQ4NTlhZDQiLCJnZW5lcmF0ZWQiOjE2Mzg3MTcyNzgsImNhbGRlcmFHdWlkIjoiMzgxMGI4NjMtMmE2NS00NDU3LTliNTgtNGRhYjNiNDgyYTg2IiwiYWNQcm92aWRlciI6IkVhc3lBbnRpQ2hlYXQiLCJub3RlcyI6IiIsImZhbGxiYWNrIjpmYWxzZX0.VAWQB67RTxhiWOxx7DBjnzDnXyyEnX7OljJm-j2d88G_WgwQ9wrE6lwMEHZHjBd1ISJdUO1UVUqkfLdU5nofBQs",
        "-skippatchcheck",
        &e_arg,
        &p_arg,
        "-AUTH_TYPE=epic",
        "-useallavailablecores",
        "-steamimportavailable",
    ]
    .iter()
    .map(|s| s.to_string())
    .collect::<Vec<String>>();

    let _child = Command::new(&fn_shipping)
        .args(&combined_args)
        .current_dir(&cwd)
        .spawn()
        .map_err(|e| format!("Failed to start Fortnite: {}", e))?;

    Ok(true)
}

#[allow(dead_code)]
fn dll_path(game_path: &Path) -> PathBuf {
    game_path
        .parent()
        .unwrap_or_else(|| Path::new("."))
        .parent()
        .unwrap_or_else(|| Path::new("."))
        .join("Engine\\Binaries\\ThirdParty\\NVIDIA\\NVaftermath\\Win64\\GFSDK_Aftermath_Lib.x64.dll")
}

#[allow(dead_code)]
fn remove_dll(game_path: &Path) -> Result<(), String> {
    let game_dll_path = dll_path(game_path);

    for _ in 0..50 {
        match std::fs::remove_file(&game_dll_path) {
            Ok(_) => break,
            Err(e) if e.kind() == std::io::ErrorKind::NotFound => break,
            Err(_) => std::thread::sleep(std::time::Duration::from_millis(100)),
        }
    }
    Ok(())
}

#[allow(dead_code)]
fn download(url: &str, dest: &Path) -> Result<(), String> {
    let response = reqwest::blocking::get(url).map_err(|e| e.to_string())?;
    let mut file = fs::File::create(dest).map_err(|e| e.to_string())?;
    let content = response.bytes().map_err(|e| e.to_string())?;
    file.write_all(&content[..]).map_err(|e| e.to_string())?;
    Ok(())
}
