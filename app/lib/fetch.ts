import { resolve } from 'path/win32';
import { baseUrl } from '../components/helpers';

export const isProd = process.env.NODE_ENV === 'production';

// export const fetchData = async (
//   query: string,
//   errorHandler?: (message: string) => void,
//   cookies?: string
// ) => {
//   const body = JSON.stringify({ query });
//   const url = baseUrl;
//   const headers: HeadersInit = {
//     'Content-Type': 'application/json',
//     ...(cookies && { Cookie: cookies }),
//   };

//   let response: Response | null = null;
//   let jsonResponse: any;

//   try {
//     response = await fetch('/api/query', {
//       credentials: 'include',
//       method: 'POST',
//       next: { revalidate: isProd ? 90 : 0 },
//       headers,
//       body,
//     });
//     console.log('fetchData', { response, status: response.status });
//     if (response.ok) {
//       jsonResponse = await response.json();
//     }
//   } catch (err) {
//     if (err instanceof Error) {
//       errorHandler?.(err.message);
//       console.error(err.message);
//     }
//   }
//   if (jsonResponse?.message) {
//     errorHandler?.(jsonResponse.message);
//     console.error(jsonResponse.message);
//   }

//   if (response && response.ok) {
//     return jsonResponse;
//   }
// };

export const getCookie = (sessionToken?: string) =>
  sessionToken ? `session-token=${sessionToken}` : undefined;
