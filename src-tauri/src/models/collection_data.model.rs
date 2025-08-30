/* sys lib */
use serde::{Deserialize, Serialize};

/* models */
use super::request_data::RequestData;

#[allow(non_snake_case)]
#[derive(Debug, Serialize, Deserialize)]
pub struct CollectionData {
  pub id: String,
  pub title: String,
  pub editTitle: bool,
  pub requests: Vec<RequestData>,
}
