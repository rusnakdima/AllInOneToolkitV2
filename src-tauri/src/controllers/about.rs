/* services */
use crate::services::about;

/* models */
use crate::models::response::Response;

#[tauri::command]
pub async fn download_update(app_handle: tauri::AppHandle, url: String, file_name: String) -> String {
  let res: Response = about::download_file(app_handle, url, file_name).await;
  format!("{}", serde_json::to_string(&res).unwrap())
}

#[tauri::command]
pub async fn get_binary_name_file() -> String {
  let res: Response = about::get_binary_name_file().await;
  format!("{}", serde_json::to_string(&res).unwrap())
}
