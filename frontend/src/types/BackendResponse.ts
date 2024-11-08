// export interface BackendResponse {
//     success: boolean
//     data: any
// }

export class BackendResponse {
    data?: any;
    succeeded?: boolean;
    errors: any;
}