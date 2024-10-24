/* services */
use crate::services::virus_total;

/* models */
use crate::models::response::Response;

#[tauri::command]
pub async fn virus_total(url: String) -> String {
  let res: Response = virus_total::req_site(url).await;
  format!("{}", serde_json::to_string(&res).unwrap())
}