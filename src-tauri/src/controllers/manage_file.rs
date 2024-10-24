/* services */
use crate::services::manage_file;

/* models */
use crate::models::response::Response;

#[tauri::command]
pub fn choose_file(app_handle: tauri::AppHandle, type_file: &str) -> String {
  let res: Response = manage_file::open_dialog_window(app_handle, type_file);
  format!("{}", serde_json::to_string(&res).unwrap())
}

#[tauri::command]
pub fn get_data_file_by_path(file_path: String) -> String {
  let res: Response = manage_file::get_data_file_by_path(file_path);
  format!("{}", serde_json::to_string(&res).unwrap())
}

#[tauri::command]
pub fn write_data_to_file(app_handle: tauri::AppHandle, name_file: String, content: String, extension: String) -> String {
  let res = manage_file::write_data_to_file(app_handle, name_file, content, extension);
  format!("{}", serde_json::to_string(&res).unwrap())
}

#[tauri::command]
pub fn open_file_in_app(path: String) -> String {
  let res = manage_file::open_file(path);
  format!("{}", serde_json::to_string(&res).unwrap())
}