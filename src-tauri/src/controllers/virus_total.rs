/* services */
use crate::services::virus_total;

/* models */
use crate::models::response::Response;

#[tauri::command]
pub async fn virus_total(url: String) -> Response {
  return virus_total::req_site(url).await;
}