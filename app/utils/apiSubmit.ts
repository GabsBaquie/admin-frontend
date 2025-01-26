// import { fetchWithAuth } from "./fetchWithAuth";

// /**
//  * Generic API submission handler for create, update, or delete operations.
//  * @param url - Base API endpoint (e.g., "days", "events", etc.).
//  * @param data - Data to be sent to the API.
//  * @param method - HTTP method ("POST", "PUT", "DELETE").
//  * @param transformData - Optional function to transform the payload before submission.
//  * @param options - Optional callbacks for success and error handling.
//  */
// export async function apiSubmit<T extends { id?: number }, U>(
//   url: string,
//   data: T,
//   method: "POST" | "PUT" | "DELETE",
//   transformData?: (data: T) => U,
//   options?: {
//     onSuccess?: () => void;
//     onError?: (error: Error) => void;
//   }
// ): Promise<void> {
//   try {
//     const payload = transformData ? transformData(data) : data;
//     const endpoint = method === "POST" ? url : `${url}/${data.id}`;

//     await fetchWithAuth(endpoint, {
//       method,
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: method === "DELETE" ? undefined : JSON.stringify(payload),
//     });

//     if (options?.onSuccess) {
//       options.onSuccess();
//     }
//   } catch (error) {
//     if (options?.onError) {
//       options.onError(error as Error);
//     }
//   }
// }