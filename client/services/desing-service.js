import { fetchWithAuth } from "./base-service";

/** Get all designs belonging to the authenticated user */
export async function getUserDesigns() {
  return fetchWithAuth("/v1/designs", {
    method: "GET",
  });
}

/** Get a single design by ID */
export async function getUserDesignByID(designId) {
  return fetchWithAuth(`/v1/designs/${designId}`, {
    method: "GET",
  });
}

/** Save (create or update) a design */
export async function saveDesign(designData, designId = null) {
  return fetchWithAuth("/v1/designs", {
    method: "POST",
    body: {
      ...designData,
      designId,
    },
  });
}

/** Delete a design by ID */
export async function deleteDesign(designId) {
  return fetchWithAuth(`/v1/designs/${designId}`, {
    method: "DELETE",
  });
}
