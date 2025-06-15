/* services */
use crate::services::url_requests;

/* models */
use crate::models::{
  collection_data::CollectionData, request_data::RequestData, response::Response,
};

#[tauri::command]
pub async fn send_request(info_request: RequestData) -> Response {
  return url_requests::send_request(info_request).await;
}

#[tauri::command]
pub fn save_data(app_handle: tauri::AppHandle, list_collections: Vec<CollectionData>) -> Response {
  return url_requests::save_data(app_handle, list_collections);
}

#[tauri::command]
pub fn get_data(app_handle: tauri::AppHandle) -> Response {
  return url_requests::get_data(app_handle);
}
