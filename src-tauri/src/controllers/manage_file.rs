/* services */
use crate::services::manage_file;

/* models */
use crate::models::response::Response;

#[tauri::command]
pub fn choose_file(app_handle: tauri::AppHandle, type_file: Vec<&str>) -> Response {
  return manage_file::open_dialog_window(app_handle, type_file);
}

#[tauri::command]
pub fn get_data_file_by_path(file_path: String) -> Response {
  return manage_file::get_data_file_by_path(file_path);
}

#[tauri::command]
pub fn write_data_to_file(
  app_handle: tauri::AppHandle,
  name_file: String,
  content: String,
  extension: String,
) -> Response {
  return manage_file::write_data_to_file(app_handle, name_file, content, extension);
}

#[tauri::command]
pub fn open_folder_with_file(path: String) -> Response {
  return manage_file::open_folder_with_file(path);
}

#[tauri::command]
pub fn open_file_in_app(path: String) -> Response {
  return manage_file::open_file(path);
}
