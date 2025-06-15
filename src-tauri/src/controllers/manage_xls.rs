/* services */
use crate::services::manage_xls;

/* models */
use crate::models::response::Response;

#[tauri::command]
pub fn get_data_file_by_path_xls(file_path: String) -> Response {
  return manage_xls::get_data_file_by_path_xls(file_path);
}

#[tauri::command]
pub fn write_data_to_file_xls(
  app_handle: tauri::AppHandle,
  name_file: String,
  content: Vec<Vec<String>>,
) -> Response {
  return manage_xls::write_data_to_file_xls(app_handle, name_file, content);
}
