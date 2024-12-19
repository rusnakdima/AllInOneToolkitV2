/* services */
use crate::services::unicode;

/* models */
use crate::models::response::Response;

#[tauri::command]
pub fn get_info_symbol(type_coding: String, content: String) -> Response {
  return unicode::get_info_symbol(type_coding, content);
}
