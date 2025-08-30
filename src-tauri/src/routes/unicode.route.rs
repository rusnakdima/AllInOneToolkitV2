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
  let unicodeController = state.unicodeController.clone();
  let result = unicodeController.getInfoSymbol(typeCoding, content);
  result
}
