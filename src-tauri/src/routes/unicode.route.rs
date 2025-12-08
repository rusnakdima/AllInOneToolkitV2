/* sys lib */
use tauri::State;

/* models */
use crate::{models::response::ResponseModel, AppState};

#[allow(non_snake_case)]
#[tauri::command]
pub fn getInfoSymbol(
  state: State<'_, AppState>,
  typeCoding: String,
  content: String,
) -> Result<ResponseModel, ResponseModel> {
  state.unicodeController.getInfoSymbol(typeCoding, content)
}
