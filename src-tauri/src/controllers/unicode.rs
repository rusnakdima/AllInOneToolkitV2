/* services */
use crate::services::unicode;

/* models */
use crate::models::response::Response;

#[tauri::command]
pub fn get_info_symbol(type_coding: String, content: String) -> String {
  let res: Response = unicode::get_info_symbol(type_coding, content);
  format!("{}", serde_json::to_string(&res).unwrap())
}
