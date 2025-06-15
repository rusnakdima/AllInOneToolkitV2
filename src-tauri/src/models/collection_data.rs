/* sys lib */
use serde::{Deserialize, Serialize};

/* models */
use super::request_data::RequestData;

#[derive(Debug, Serialize, Deserialize)]
pub struct CollectionData {
  pub id: String,
  pub title: String,
  pub editTitle: bool,
  pub requests: Vec<RequestData>,
}
