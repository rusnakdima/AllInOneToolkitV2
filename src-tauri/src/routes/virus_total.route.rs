/* sys lib */
use tauri::State;

/* models */
use crate::{models::response::ResponseModel, AppState};

#[allow(non_snake_case)]
#[tauri::command]
pub async fn virusTotal(
  state: State<'_, AppState>,
  url: String,
) -> Result<ResponseModel, ResponseModel> {
  state.virusTotalController.virusTotal(url).await
}
